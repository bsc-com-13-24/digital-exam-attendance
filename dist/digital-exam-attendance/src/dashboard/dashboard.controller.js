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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const dashboard_service_1 = require("./dashboard.service");
const swagger_1 = require("@nestjs/swagger");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getLiveSessionDashboard(sessionId) {
        const report = await this.dashboardService.getAttendanceReport(sessionId);
        const actualAttendees = report.present + report.late;
        return {
            sessionId,
            registeredStudents: report.totalEnrolled,
            actualAttendees,
            attendanceRate: report.totalEnrolled > 0
                ? (actualAttendees / report.totalEnrolled) * 100
                : 0,
            stats: {
                present: report.present,
                absent: report.absent,
                late: report.late,
                completed: report.completed
            }
        };
    }
    async getOverallStatistics() {
        const [activeSessions, upcomingSessions, expiredSessions] = await Promise.all([
            this.dashboardService.getActiveSessions(),
            this.dashboardService.getUpcomingSessions(),
            this.dashboardService.getExpiredSessions()
        ]);
        return {
            totalSessions: activeSessions + upcomingSessions + expiredSessions,
            activeSessions,
            upcomingSessions,
            expiredSessions
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    (0, common_1.Get)(':sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLiveSessionDashboard", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOverallStatistics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map