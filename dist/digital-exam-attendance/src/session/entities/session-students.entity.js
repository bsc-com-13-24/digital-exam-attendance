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
exports.SessionStudent = void 0;
const typeorm_1 = require("typeorm");
const sessions_entity_1 = require("./sessions.entity");
let SessionStudent = class SessionStudent {
    id;
    session;
    session_id;
    student_number;
    full_name;
    added_at;
};
exports.SessionStudent = SessionStudent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SessionStudent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sessions_entity_1.Session, (session) => session.students, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", sessions_entity_1.Session)
], SessionStudent.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], SessionStudent.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_number', length: 50 }),
    __metadata("design:type", String)
], SessionStudent.prototype, "student_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 255 }),
    __metadata("design:type", String)
], SessionStudent.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'added_at' }),
    __metadata("design:type", Date)
], SessionStudent.prototype, "added_at", void 0);
exports.SessionStudent = SessionStudent = __decorate([
    (0, typeorm_1.Entity)('session_students'),
    (0, typeorm_1.Unique)(['session_id', 'student_number'])
], SessionStudent);
//# sourceMappingURL=session-students.entity.js.map