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
exports.CreateSessionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSessionDto {
    title;
    course_codes;
    room_code;
    venue;
    scheduled_start;
    scheduled_end;
    expected_students;
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mid-term Exam Session 1', description: 'Title of the exam session' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['COM211', 'COM212'], description: 'List of unique course codes' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateSessionDto.prototype, "course_codes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The room code where the session will be held', example: 'A101' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "room_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The room name or general venue description (e.g. Lecture Theatre 1)', example: 'Lecture Theatre 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "venue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The scheduled start time of the session', example: '2023-10-25T09:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "scheduled_start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The scheduled end time of the session', example: '2023-10-25T12:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "scheduled_end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The number of students expected to attend', example: 50, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "expected_students", void 0);
//# sourceMappingURL=create-session.dto.js.map