"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const offline_service_1 = require("./offline.service");
const offline_controller_1 = require("./offline.controller");
const attendance_records_entity_1 = require("../attendance/entities/attendance-records.entity");
const session_students_entity_1 = require("../session/entities/session-students.entity");
const sessions_entity_1 = require("../session/entities/sessions.entity");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../auth/guards/roles.guard");
let OfflineModule = class OfflineModule {
};
exports.OfflineModule = OfflineModule;
exports.OfflineModule = OfflineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([attendance_records_entity_1.AttendanceRecord, session_students_entity_1.SessionStudent, sessions_entity_1.Session]),
            auth_module_1.AuthModule,
        ],
        providers: [offline_service_1.OfflineService, roles_guard_1.RolesGuard],
        controllers: [offline_controller_1.OfflineController],
        exports: [offline_service_1.OfflineService],
    })
], OfflineModule);
//# sourceMappingURL=offline.module.js.map