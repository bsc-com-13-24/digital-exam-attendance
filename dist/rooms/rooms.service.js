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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rooms_entity_1 = require("./entities/rooms.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const attendance_records_entity_1 = require("../attendance/entities/attendance-records.entity");
let RoomsService = class RoomsService {
    roomRepository;
    sessionStudentRepository;
    attendanceRepository;
    constructor(roomRepository, sessionStudentRepository, attendanceRepository) {
        this.roomRepository = roomRepository;
        this.sessionStudentRepository = sessionStudentRepository;
        this.attendanceRepository = attendanceRepository;
    }
    async createRoom(dto, userId) {
        const existing = await this.roomRepository.findOne({
            where: { room_code: dto.room_code },
        });
        if (existing) {
            throw new common_1.ConflictException(`Room with code "${dto.room_code}" already exists`);
        }
        const room = this.roomRepository.create({
            ...dto,
            created_by: userId,
        });
        return await this.roomRepository.save(room);
    }
    async getAllRooms(activeOnly) {
        if (activeOnly) {
            return await this.roomRepository.find({
                where: { is_active: true },
                order: { name: 'ASC' },
            });
        }
        return await this.roomRepository.find({ order: { name: 'ASC' } });
    }
    async getRoomById(id) {
        const room = await this.roomRepository.findOne({ where: { id } });
        if (!room) {
            throw new common_1.NotFoundException(`Room with ID ${id} not found`);
        }
        return room;
    }
    async getRoomByCode(roomCode) {
        const room = await this.roomRepository.findOne({
            where: { room_code: roomCode },
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with code "${roomCode}" not found`);
        }
        return room;
    }
    async updateRoom(id, dto, userId) {
        const room = await this.getRoomById(id);
        if (room.created_by !== userId) {
            throw new common_1.ForbiddenException('You can only update rooms you created');
        }
        await this.roomRepository.update(id, dto);
        return await this.getRoomById(id);
    }
    async deleteRoom(id, userId) {
        const room = await this.getRoomById(id);
        if (room.created_by !== userId) {
            throw new common_1.ForbiddenException('You can only delete rooms you created');
        }
        await this.roomRepository.delete(id);
        return { message: `Room ${id} deleted successfully` };
    }
    async getSessionsByRoom(roomId) {
        const room = await this.roomRepository.findOne({
            where: { id: roomId },
            relations: ['sessions', 'sessions.course'],
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
        }
        return room;
    }
    async verifyStudentInRoom(sessionId, roomCode, studentId) {
        const room = await this.roomRepository.findOne({ where: { room_code: roomCode } });
        if (!room) {
            return { valid: false, message: 'Invalid room code' };
        }
        const enrollment = await this.sessionStudentRepository.findOne({
            where: { session_id: sessionId, student_number: studentId }
        });
        if (!enrollment) {
            return { valid: false, message: 'Student not enrolled in this session' };
        }
        return {
            valid: true,
            room: {
                id: room.id,
                name: room.name,
                building: room.building,
                room_code: room.room_code
            }
        };
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rooms_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(session_students_entity_1.SessionStudent)),
    __param(2, (0, typeorm_1.InjectRepository)(attendance_records_entity_1.AttendanceRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map