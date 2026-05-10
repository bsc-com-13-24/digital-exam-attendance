"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const attendance_records_entity_1 = require("./entities/attendance-records.entity");
const audit_logs_entity_1 = require("./entities/audit-logs.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const sessions_entity_1 = require("../session/entities/sessions.entity");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../auth/guards/roles.guard");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([attendance_records_entity_1.AttendanceRecord, audit_logs_entity_1.AuditLog, session_students_entity_1.SessionStudent, sessions_entity_1.Session]),
            auth_module_1.AuthModule,
        ],
        providers: [attendance_service_1.AttendanceService, roles_guard_1.RolesGuard],
        controllers: [attendance_controller_1.AttendanceController],
        exports: [attendance_service_1.AttendanceService],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map