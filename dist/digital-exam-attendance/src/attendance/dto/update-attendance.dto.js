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
exports.UpdateAttendanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_attendance_dto_1 = require("./create-attendance.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const attendance_records_entity_1 = require("../entities/attendance-records.entity");
class UpdateAttendanceDto extends (0, swagger_1.PartialType)(create_attendance_dto_1.CreateAttendanceDto) {
    status;
    method;
    remarks;
    marked_by;
}
exports.UpdateAttendanceDto = UpdateAttendanceDto;
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'PRESENT', enum: attendance_records_entity_1.AttendanceStatus, description: 'Updated attendance status' }),
    (0, class_validator_1.IsEnum)(attendance_records_entity_1.AttendanceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Manual', description: 'Updated method of attendance (e.g., Manual, Auto, Scanned)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "method", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Late entry', description: 'Updated remarks for the attendance record' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'ID of the user who is updating the record' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "marked_by", void 0);
//# sourceMappingURL=update-attendance.dto.js.map