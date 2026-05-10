"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_records_entity_1 = require("./entities/attendance-records.entity");
const audit_logs_entity_1 = require("./entities/audit-logs.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const sessions_entity_1 = require("../session/entities/sessions.entity");
let AttendanceService = class AttendanceService {
    attendanceRepository;
    auditLogRepository;
    sessionStudentRepository;
    sessionRepository;
    constructor(attendanceRepository, auditLogRepository, sessionStudentRepository, sessionRepository) {
        this.attendanceRepository = attendanceRepository;
        this.auditLogRepository = auditLogRepository;
        this.sessionStudentRepository = sessionStudentRepository;
        this.sessionRepository = sessionRepository;
    }
    async markAttendance(dto, userId) {
        const sessionStudent = await this.sessionStudentRepository.findOne({
            where: { student_number: dto.student_number, session_id: dto.session_id },
        });
        if (!sessionStudent)
            throw new common_1.BadRequestException('Student is not registered for this session');
        const session = await this.sessionRepository.findOne({ where: { id: dto.session_id } });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        const existing = await this.attendanceRepository.findOne({
            where: { session_id: dto.session_id, session_student_id: sessionStudent.student_number },
        });
        const now = new Date();
        if (!existing) {
            const status = now > session.scheduled_start ? attendance_records_entity_1.AttendanceStatus.LATE : attendance_records_entity_1.AttendanceStatus.PRESENT;
            const record = this.attendanceRepository.create({
                ...dto,
                session_student_id: sessionStudent.student_number,
                status,
                marked_at: now,
                marked_by: userId
            });
            const saved = await this.attendanceRepository.save(record);
            await this.logAudit(userId || dto.marked_by || 'system', 'MARK_ATTENDANCE', 'attendance_record', saved.id);
            return saved;
        }
        if (existing.status === attendance_records_entity_1.AttendanceStatus.COMPLETED) {
            throw new common_1.ConflictException('Student has already completed this session');
        }
        existing.status = attendance_records_entity_1.AttendanceStatus.COMPLETED;
        existing.marked_at = now;
        const saved = await this.attendanceRepository.save(existing);
        await this.logAudit(userId || dto.marked_by || 'system', 'MARK_ATTENDANCE', 'attendance_record', saved.id);
        return saved;
    }
    async bulkMarkAttendance(dto, userId) {
        const records = [];
        for (const recordDto of dto.records) {
            if (recordDto.session_id !== dto.session_id) {
                throw new common_1.BadRequestException('Session ID mismatch in bulk records');
            }
            const record = await this.markAttendance(recordDto, userId);
            records.push(record);
        }
        return records;
    }
    async updateAttendance(id, dto, updatedBy) {
        const record = await this.attendanceRepository.findOne({ where: { id } });
        if (!record) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        Object.assign(record, dto);
        record.marked_at = new Date();
        const saved = await this.attendanceRepository.save(record);
        await this.logAudit(updatedBy || 'system', 'UPDATE_ATTENDANCE', 'attendance_record', saved.id);
        return saved;
    }
    async getAttendanceRecords(query) {
        const qb = this.attendanceRepository.createQueryBuilder('record')
            .leftJoinAndSelect('record.session', 'session')
            .leftJoinAndSelect('record.session_student', 'session_student')
            .leftJoinAndSelect('record.marked_by_user', 'marked_by_user');
        if (query.session_id) {
            qb.andWhere('record.session_id = :session_id', { session_id: query.session_id });
        }
        if (query.student_number) {
            qb.andWhere('session_student.student_number = :student_number', { student_number: query.student_number });
        }
        if (query.status) {
            qb.andWhere('record.status = :status', { status: query.status });
        }
        if (query.method) {
            qb.andWhere('record.method = :method', { method: query.method });
        }
        if (query.course_id) {
            qb.innerJoin('session.courses', 'course', 'course.id = :course_id', {
                course_id: query.course_id,
            });
        }
        return qb.getMany();
    }
    async searchStudentsForManualMark(sessionId, search) {
        const upperSearch = `%${search.toUpperCase()}%`;
        return this.sessionStudentRepository.createQueryBuilder('ss')
            .where('ss.session_id = :sessionId', { sessionId })
            .andWhere('(UPPER(ss.student_number) LIKE :search OR UPPER(ss.full_name) LIKE :search)', { search: upperSearch })
            .getMany();
    }
    async logAudit(userId, action, entityType, entityId) {
        const log = this.auditLogRepository.create({
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
        });
        await this.auditLogRepository.save(log);
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_records_entity_1.AttendanceRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(audit_logs_entity_1.AuditLog)),
    __param(2, (0, typeorm_1.InjectRepository)(session_students_entity_1.SessionStudent)),
    __param(3, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map