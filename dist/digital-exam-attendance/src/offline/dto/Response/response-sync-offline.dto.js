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
exports.OfflineSyncResponseDto = exports.SyncResultDto = exports.OfflineSyncErrorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OfflineSyncErrorDto {
    localId;
    reason;
}
exports.OfflineSyncErrorDto = OfflineSyncErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for sync failure' }),
    __metadata("design:type", String)
], OfflineSyncErrorDto.prototype, "localId", void 0);
class SyncResultDto {
    successCount;
    failureCount;
    failures;
}
exports.SyncResultDto = SyncResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Successful sync' }),
    __metadata("design:type", Number)
], SyncResultDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'number of failed sync trials' }),
    __metadata("design:type", Number)
], SyncResultDto.prototype, "failureCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OfflineSyncErrorDto] }),
    __metadata("design:type", Array)
], SyncResultDto.prototype, "failures", void 0);
class OfflineSyncResponseDto {
    success;
    message;
    data;
}
exports.OfflineSyncResponseDto = OfflineSyncResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Successful sync or sync failure message' }),
    __metadata("design:type", Boolean)
], OfflineSyncResponseDto.prototype, "success", void 0);
//# sourceMappingURL=response-sync-offline.dto.js.map