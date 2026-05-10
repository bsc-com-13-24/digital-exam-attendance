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
exports.Course = void 0;
const typeorm_1 = require("typeorm");
const sessions_entity_1 = require("../../session/entities/sessions.entity");
const users_entity_1 = require("../../auth/entities/users.entity");
let Course = class Course {
    id;
    code;
    name;
    is_active;
    creator_user;
    creator_id;
    created_by;
    created_at;
    sessions;
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Course.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20 }),
    __metadata("design:type", String)
], Course.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Course.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Course.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", users_entity_1.User)
], Course.prototype, "creator_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator_id' }),
    __metadata("design:type", String)
], Course.prototype, "creator_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', length: 255 }),
    __metadata("design:type", String)
], Course.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Course.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => sessions_entity_1.Session, (session) => session.courses),
    __metadata("design:type", Array)
], Course.prototype, "sessions", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)('courses')
], Course);
//# sourceMappingURL=courses.entity.js.map