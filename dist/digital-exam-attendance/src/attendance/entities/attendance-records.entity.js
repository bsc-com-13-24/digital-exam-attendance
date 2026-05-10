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
exports.AttendanceRecord = exports.AttendanceStatus = void 0;
const typeorm_1 = require("typeorm");
const sessions_entity_1 = require("../../session/entities/sessions.entity");
const users_entity_1 = require("../../auth/entities/users.entity");
const session_students_entity_1 = require("../../session/entities/session-students.entity");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["COMPLETED"] = "completed";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
let AttendanceRecord = class AttendanceRecord {
    id;
    session;
    session_id;
    session_student;
    session_student_id;
    status;
    marked_by_user;
    marked_by;
    marked_at;
    method;
    remarks;
    created_at;
    updated_at;
};
exports.AttendanceRecord = AttendanceRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sessions_entity_1.Session, (session) => session.attendance_records, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", sessions_entity_1.Session)
], AttendanceRecord.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_students_entity_1.SessionStudent, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_student_id' }),
    __metadata("design:type", session_students_entity_1.SessionStudent)
], AttendanceRecord.prototype, "session_student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_student_id' }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "session_student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar2',
        enum: AttendanceStatus,
        default: AttendanceStatus.ABSENT,
    }),
    __metadata("design:type", String)
], AttendanceRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'marked_by' }),
    __metadata("design:type", users_entity_1.User)
], AttendanceRecord.prototype, "marked_by_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marked_by', type: 'varchar2', length: 100, nullable: true }),
    __metadata("design:type", Object)
], AttendanceRecord.prototype, "marked_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marked_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], AttendanceRecord.prototype, "marked_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar2', length: 20, nullable: true }),
    __metadata("design:type", Object)
], AttendanceRecord.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'clob', nullable: true }),
    __metadata("design:type", Object)
], AttendanceRecord.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AttendanceRecord.prototype, "updated_at", void 0);
exports.AttendanceRecord = AttendanceRecord = __decorate([
    (0, typeorm_1.Entity)('attendance_records'),
    (0, typeorm_1.Unique)(['session_id', 'session_student_id'])
], AttendanceRecord);
//# sourceMappingURL=attendance-records.entity.js.map