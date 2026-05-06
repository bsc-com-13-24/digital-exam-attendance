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
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const session_service_1 = require("./session.service");
const create_session_dto_1 = require("./dto/create-session.dto");
const update_session_dto_1 = require("./dto/update-session.dto");
const enroll_students_dto_1 = require("./dto/enroll-students.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
let SessionController = class SessionController {
    sessionService;
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async createSession(dto, req) {
        return await this.sessionService.createSession(dto, req.user.userId);
    }
    async getSessions(status) {
        return await this.sessionService.getAllSessions(status);
    }
    async getSessionById(sessionId) {
        return await this.sessionService.getSessionById(sessionId);
    }
    async getEnrolledStudents(sessionId) {
        return await this.sessionService.getStudentsInSession(sessionId);
    }
    async enrollStudents(sessionId, dto) {
        return await this.sessionService.enrollStudents(sessionId, dto);
    }
    async updateSession(sessionId, dto, req) {
        return await this.sessionService.updateSession(sessionId, dto, req.user.userId);
    }
    async deleteSession(sessionId, req) {
        return await this.sessionService.deleteSession(sessionId, req.user.userId);
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "createSession", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessions", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(':sessionId'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getSessionById", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(':sessionId/students'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getEnrolledStudents", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, common_1.Post)(':sessionId/enrollments'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, enroll_students_dto_1.EnrollStudentsDto]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "enrollStudents", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, common_1.Patch)(':sessionId'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_session_dto_1.UpdateSessionDto, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "updateSession", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, common_1.Delete)(':sessionId'),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "deleteSession", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)('sessions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], SessionController);
//# sourceMappingURL=session.controller.js.map