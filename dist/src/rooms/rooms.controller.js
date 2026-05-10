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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rooms_service_1 = require("./rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    async createRoom(dto, req) {
        return await this.roomsService.createRoom(dto, req.user.userId, req.user.fullName);
    }
    async getAllRooms(activeOnly) {
        return await this.roomsService.getAllRooms(activeOnly === 'true');
    }
    async getRoomById(roomId) {
        return await this.roomsService.getRoomById(roomId);
    }
    async getRoomByCode(roomCode) {
        return await this.roomsService.getRoomByCode(roomCode);
    }
    async getSessionsByRoom(roomId) {
        return await this.roomsService.getSessionsByRoom(roomId);
    }
    async updateRoom(roomId, dto, req) {
        return await this.roomsService.updateRoom(roomId, dto, req.user.userId);
    }
    async deleteRoom(roomId, req) {
        return await this.roomsService.deleteRoom(roomId, req.user.userId);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "createRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getAllRooms", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(':roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getRoomById", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)('code/:roomCode'),
    __param(0, (0, common_1.Param)('roomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getRoomByCode", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(':roomId/sessions'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getSessionsByRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Patch)(':roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "updateRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Delete)(':roomId'),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "deleteRoom", null);
exports.RoomsController = RoomsController = __decorate([
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map