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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sessions_entity_1 = require("../session/entities/sessions.entity");
const attendance_records_entity_1 = require("../attendance/entities/attendance-records.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const typeorm_3 = require("typeorm");
let DashboardService = class DashboardService {
    sessionRepository;
    attendanceRepository;
    sessionStudentRepository;
    constructor(sessionRepository, attendanceRepository, sessionStudentRepository) {
        this.sessionRepository = sessionRepository;
        this.attendanceRepository = attendanceRepository;
        this.sessionStudentRepository = sessionStudentRepository;
    }
    async getActiveSessions() {
        return await this.sessionRepository.count({
            where: { status: "active" }
        });
    }
    async getUpcomingSessions() {
        return await this.sessionRepository.count({
            where: { status: "upcoming" }
        });
    }
    async getExpiredSessions() {
        return await this.sessionRepository.count({
            where: { status: "expired" }
        });
    }
    async countRegisteredStudents(sessionId) {
        return await this.sessionStudentRepository.count({
            where: { session_id: sessionId }
        });
    }
    async countActualAttendees(sessionId) {
        return await this.attendanceRepository.count({
            where: {
                session_id: sessionId,
                status: (0, typeorm_3.In)([attendance_records_entity_1.AttendanceStatus.PRESENT, attendance_records_entity_1.AttendanceStatus.LATE])
            }
        });
    }
    async getAttendanceReport(sessionId) {
        const [totalEnrolled, stats] = await Promise.all([
            this.sessionRepository
                .createQueryBuilder('session')
                .leftJoin('session.students', 'student')
                .where('session.id = :sessionId', { sessionId })
                .getCount(),
            this.attendanceRepository
                .createQueryBuilder('record')
                .select('record.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .where('record.session_id = :sessionId', { sessionId })
                .groupBy('record.status')
                .getRawMany()
        ]);
        return {
            totalEnrolled,
            present: this.findCount(stats, 'present'),
            absent: this.findCount(stats, 'absent'),
            late: this.findCount(stats, 'late'),
            completed: this.findCount(stats, 'completed'),
        };
    }
    findCount(stats, status) {
        const row = stats.find(s => s.status === status);
        return row ? parseInt(row.count) : 0;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __param(1, (0, typeorm_1.InjectRepository)(attendance_records_entity_1.AttendanceRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(session_students_entity_1.SessionStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map