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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const bulk_mark_attendance_dto_1 = require("./dto/bulk-mark-attendance.dto");
const attendance_query_dto_1 = require("./dto/attendance-query.dto");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async markAttendance(dto, req) {
        return this.attendanceService.markAttendance(dto, req.user.userId);
    }
    async bulkMarkAttendance(dto, req) {
        return this.attendanceService.bulkMarkAttendance(dto, req.user.userId);
    }
    async updateAttendance(id, dto, req) {
        return this.attendanceService.updateAttendance(id, dto, req.user.userId);
    }
    async getAttendanceRecords(query) {
        return this.attendanceService.getAttendanceRecords(query);
    }
    async searchStudentsForManualMark(sessionId, search) {
        return this.attendanceService.searchStudentsForManualMark(sessionId, search);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Post)('mark'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Post)('bulk-mark'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_mark_attendance_dto_1.BulkMarkAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "bulkMarkAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_dto_1.UpdateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceQueryDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceRecords", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher', 'invigilator'),
    (0, common_1.Get)('manual-search/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "searchStudentsForManualMark", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map