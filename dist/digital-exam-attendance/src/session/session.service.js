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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sessions_entity_1 = require("./entities/sessions.entity");
const session_students_entity_1 = require("./entities/session-students.entity");
const rooms_service_1 = require("../rooms/rooms.service");
const courses_service_1 = require("../courses/courses.service");
const auth_service_1 = require("../auth/auth.service");
let SessionService = class SessionService {
    sessionRepository;
    sessionStudentRepository;
    roomsService;
    coursesService;
    authService;
    constructor(sessionRepository, sessionStudentRepository, roomsService, coursesService, authService) {
        this.sessionRepository = sessionRepository;
        this.sessionStudentRepository = sessionStudentRepository;
        this.roomsService = roomsService;
        this.coursesService = coursesService;
        this.authService = authService;
    }
    async createSession(dto, userId, fullName) {
        const { course_codes, room_code, ...rest } = dto;
        const courses = [];
        for (const code of course_codes) {
            const course = await this.coursesService.getCourseByCode(code);
            courses.push(course);
        }
        const room = await this.roomsService.getRoomByCode(room_code);
        if (!room.is_active) {
            throw new common_1.BadRequestException(`Room "${room.name}" is not currently active`);
        }
        if (dto.expected_students) {
            if (dto.expected_students > room.capacity) {
                throw new common_1.BadRequestException(`Room "${room.name}" capacity (${room.capacity}) is less than expected students (${dto.expected_students})`);
            }
        }
        await this.checkRoomConflicts(room.id, new Date(dto.scheduled_start), new Date(dto.scheduled_end));
        const session = this.sessionRepository.create({
            ...rest,
            creator_id: userId,
            created_by: fullName,
            courses: courses,
            room: room,
            room_id: room.id,
        });
        return await this.sessionRepository.save(session);
    }
    async checkRoomConflicts(roomId, start, end, excludeSessionId) {
        const query = this.sessionRepository
            .createQueryBuilder('session')
            .where('session.room_id = :roomId', { roomId })
            .andWhere('session.status != :cancelled', { cancelled: 'cancelled' })
            .andWhere('(session.scheduled_start < :end AND session.scheduled_end > :start)', { start, end });
        if (excludeSessionId) {
            query.andWhere('session.id != :excludeSessionId', { excludeSessionId });
        }
        const conflict = await query.getOne();
        if (conflict) {
            throw new common_1.ConflictException(`Room is already booked for session "${conflict.title}" during this time`);
        }
    }
    async getAllSessions(status) {
        if (status) {
            return await this.sessionRepository.find({
                where: { status },
                relations: ['courses', 'room'],
                order: { scheduled_start: 'ASC' },
            });
        }
        return await this.sessionRepository.find({
            relations: ['courses', 'room'],
            order: { scheduled_start: 'ASC' },
        });
    }
    async getSessionById(id) {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['courses', 'room'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        return session;
    }
    async getSessionByStatus(status) {
        return await this.sessionRepository.find({
            where: { status },
            relations: ['courses', 'room'],
            order: { scheduled_start: 'ASC' },
        });
    }
    async updateSession(id, updateSessionDto, userId) {
        const session = await this.getSessionById(id);
        if (session.creator_id !== userId) {
            throw new common_1.ForbiddenException('You can only update sessions you created');
        }
        const { course_codes, room_code, ...rest } = updateSessionDto;
        if (course_codes) {
            const courses = [];
            for (const code of course_codes) {
                const course = await this.coursesService.getCourseByCode(code);
                courses.push(course);
            }
            session.courses = courses;
        }
        if (room_code) {
            const room = await this.roomsService.getRoomByCode(room_code);
            if (!room.is_active) {
                throw new common_1.BadRequestException(`Room "${room.name}" is not currently active`);
            }
            session.room = room;
            session.room_id = room.id;
        }
        if (updateSessionDto.venue) {
            const room = await this.roomsService.getRoomByCodeOrName(updateSessionDto.venue);
            session.room = room;
            session.room_id = room.id;
            session.venue = room.name;
        }
        Object.assign(session, rest);
        return await this.sessionRepository.save(session);
    }
    async removeSession(id, userId) {
        const session = await this.getSessionById(id);
        if (session.creator_id !== userId) {
            throw new common_1.ForbiddenException('You can only delete sessions you created');
        }
        await this.sessionRepository.delete(id);
        return { message: `Session ${id} deleted successfully` };
    }
    async deleteSession(id, userId) {
        return this.removeSession(id, userId);
    }
    async enrollStudents(sessionId, dto) {
        const session = await this.getSessionById(sessionId);
        const enrollments = [];
        for (const studentDto of dto.students) {
            const existing = await this.sessionStudentRepository.findOne({
                where: {
                    session_id: sessionId,
                    student_number: studentDto.student_number,
                },
            });
            if (!existing) {
                const enrollment = this.sessionStudentRepository.create({
                    session_id: sessionId,
                    student_number: studentDto.student_number,
                    full_name: studentDto.full_name,
                });
                enrollments.push(enrollment);
            }
        }
        if (enrollments.length > 0) {
            return await this.sessionStudentRepository.save(enrollments);
        }
        return await this.getStudentsBySessionId(sessionId);
    }
    async getStudentsBySessionId(sessionId) {
        return await this.sessionStudentRepository.find({
            where: { session_id: sessionId },
        });
    }
    async getStudentsInSession(sessionId) {
        return this.getStudentsBySessionId(sessionId);
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __param(1, (0, typeorm_1.InjectRepository)(session_students_entity_1.SessionStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        rooms_service_1.RoomsService,
        courses_service_1.CoursesService,
        auth_service_1.AuthService])
], SessionService);
//# sourceMappingURL=session.service.js.map