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
exports.SyncOfflineDto = exports.OfflineAttendanceRecordDto = exports.ScanMethod = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const attendance_records_entity_1 = require("../../attendance/entities/attendance-records.entity");
const swagger_1 = require("@nestjs/swagger");
var ScanMethod;
(function (ScanMethod) {
    ScanMethod["SCAN"] = "scan";
    ScanMethod["MANUAL"] = "manual";
})(ScanMethod || (exports.ScanMethod = ScanMethod = {}));
class OfflineAttendanceRecordDto {
    localId;
    sessionId;
    studentNumber;
    status;
    method;
    markedAt;
    remarks;
}
exports.OfflineAttendanceRecordDto = OfflineAttendanceRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Local ID for offline tracking', example: 'offline-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "localId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID', example: 'session-001' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student registration number', example: 'BSC-COM-02-24' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "studentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: attendance_records_entity_1.AttendanceStatus, description: 'Attendance status', example: 'present, absent or late' }),
    (0, class_validator_1.IsEnum)(attendance_records_entity_1.AttendanceStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ScanMethod, description: 'Scan or Manual' }),
    (0, class_validator_1.IsEnum)(ScanMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "markedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Optional remarks if exam was incomplete', example: 'Student left early due to illness' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OfflineAttendanceRecordDto.prototype, "remarks", void 0);
class SyncOfflineDto {
    deviceId;
    offlineRecords;
    lastSyncTimestamp;
}
exports.SyncOfflineDto = SyncOfflineDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device ID', example: 'scanner-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SyncOfflineDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OfflineAttendanceRecordDto], description: 'Records synced from offline storage' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OfflineAttendanceRecordDto),
    __metadata("design:type", Array)
], SyncOfflineDto.prototype, "offlineRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of the last successful sync', required: false }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SyncOfflineDto.prototype, "lastSyncTimestamp", void 0);
//# sourceMappingURL=sync-offline.dto.js.map