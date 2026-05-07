"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const session_service_1 = require("./session.service");
const session_controller_1 = require("./session.controller");
const sessions_entity_1 = require("./entities/sessions.entity");
const courses_entity_1 = require("../courses/entities/courses.entity");
const session_students_entity_1 = require("./entities/session-students.entity");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../auth/guards/roles.guard");
const session_scheduler_1 = require("./session.scheduler");
const rooms_module_1 = require("../rooms/rooms.module");
let SessionModule = class SessionModule {
};
exports.SessionModule = SessionModule;
exports.SessionModule = SessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sessions_entity_1.Session, courses_entity_1.Course, session_students_entity_1.SessionStudent]),
            auth_module_1.AuthModule,
            rooms_module_1.RoomsModule,
        ],
        providers: [session_service_1.SessionService, roles_guard_1.RolesGuard, session_scheduler_1.SessionSchedulerService],
        controllers: [session_controller_1.SessionController],
        exports: [session_service_1.SessionService],
    })
], SessionModule);
//# sourceMappingURL=session.module.js.map