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
exports.OfflineRecordRequestDto = exports.ScanMethod = exports.AttendanceStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var ScanMethod;
(function (ScanMethod) {
    ScanMethod["SCAN"] = "scan";
    ScanMethod["MANUAL"] = "manual";
})(ScanMethod || (exports.ScanMethod = ScanMethod = {}));
class OfflineRecordRequestDto {
    localId;
    sessionId;
    studentId;
    status;
    method;
    markedAt;
    remarks;
}
exports.OfflineRecordRequestDto = OfflineRecordRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Local ID for offline tracking', example: 'offline-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "localId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID', example: 'session-001' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student Registration Number', example: 'BSC-COM-02-24' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AttendanceStatus, description: 'Attendance status', example: 'present, absent or late' }),
    (0, class_validator_1.IsEnum)(AttendanceStatus),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ScanMethod, description: 'Scan or Manual', example: 'scan or manual' }),
    (0, class_validator_1.IsEnum)(ScanMethod),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp when marked', example: '2023-10-01T10:00:00Z' }),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "markedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Optional remarks if exam was incomplete', example: 'Student left early due to illness' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OfflineRecordRequestDto.prototype, "remarks", void 0);
//# sourceMappingURL=request-sync-offline.dto.js.map