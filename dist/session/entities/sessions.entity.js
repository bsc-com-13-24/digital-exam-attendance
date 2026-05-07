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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const typeorm_1 = require("typeorm");
const courses_entity_1 = require("../../courses/entities/courses.entity");
const session_students_entity_1 = require("./session-students.entity");
const attendance_records_entity_1 = require("../../attendance/entities/attendance-records.entity");
const users_entity_1 = require("../../auth/entities/users.entity");
const rooms_entity_1 = require("../../rooms/entities/rooms.entity");
let Session = class Session {
    id;
    title;
    venue;
    scheduled_start;
    scheduled_end;
    status;
    course;
    course_id;
    room;
    room_id;
    created_by_user;
    created_by;
    created_at;
    students;
    attendance_records;
};
exports.Session = Session;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Session.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venue', length: 255 }),
    __metadata("design:type", String)
], Session.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_start', type: 'timestamp' }),
    __metadata("design:type", Date)
], Session.prototype, "scheduled_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_end', type: 'timestamp' }),
    __metadata("design:type", Date)
], Session.prototype, "scheduled_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'upcoming' }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => courses_entity_1.Course, (course) => course.sessions),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", courses_entity_1.Course)
], Session.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id' }),
    __metadata("design:type", String)
], Session.prototype, "course_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rooms_entity_1.Room, (room) => room.sessions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", rooms_entity_1.Room)
], Session.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "room_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", users_entity_1.User)
], Session.prototype, "created_by_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], Session.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Session.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => session_students_entity_1.SessionStudent, (sessionStudent) => sessionStudent.session),
    __metadata("design:type", Array)
], Session.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendance_records_entity_1.AttendanceRecord, (record) => record.session),
    __metadata("design:type", Array)
], Session.prototype, "attendance_records", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)('sessions')
], Session);
//# sourceMappingURL=sessions.entity.js.map