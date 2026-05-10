"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const session_module_1 = require("./session/session.module");
const offline_module_1 = require("./offline/offline.module");
const attendance_module_1 = require("./attendance/attendance.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const users_entity_1 = require("./auth/entities/users.entity");
const roles_entity_1 = require("./auth/entities/roles.entity");
const user_roles_entity_1 = require("./auth/entities/user-roles.entity");
const courses_entity_1 = require("./courses/entities/courses.entity");
const sessions_entity_1 = require("./session/entities/sessions.entity");
const session_students_entity_1 = require("./session/entities/session-students.entity");
const attendance_records_entity_1 = require("./attendance/entities/attendance-records.entity");
const audit_logs_entity_1 = require("./attendance/entities/audit-logs.entity");
const schedule_1 = require("@nestjs/schedule");
const rooms_module_1 = require("./rooms/rooms.module");
const rooms_entity_1 = require("./rooms/entities/rooms.entity");
const courses_module_1 = require("./courses/courses.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'oracle',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    serviceName: config.get('DB_SERVICE_NAME'),
                    synchronize: config.get('DB_SYNCHRONIZE') === 'true',
                    entities: [
                        users_entity_1.User,
                        roles_entity_1.Role,
                        user_roles_entity_1.UserRole,
                        courses_entity_1.Course,
                        sessions_entity_1.Session,
                        session_students_entity_1.SessionStudent,
                        attendance_records_entity_1.AttendanceRecord,
                        audit_logs_entity_1.AuditLog,
                        rooms_entity_1.Room,
                    ],
                    logging: true,
                }),
            }),
            auth_module_1.AuthModule,
            session_module_1.SessionModule,
            attendance_module_1.AttendanceModule,
            offline_module_1.OfflineModule,
            dashboard_module_1.DashboardModule,
            rooms_module_1.RoomsModule,
            courses_module_1.CoursesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map