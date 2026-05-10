"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineSyncResponseDto = exports.SyncResultDto = exports.OfflineSyncErrorDto = void 0;
class OfflineSyncErrorDto {
    localId;
    reason;
}
exports.OfflineSyncErrorDto = OfflineSyncErrorDto;
class SyncResultDto {
    successCount;
    failureCount;
    failures;
}
exports.SyncResultDto = SyncResultDto;
class OfflineSyncResponseDto {
    success;
    message;
    data;
}
exports.OfflineSyncResponseDto = OfflineSyncResponseDto;
//# sourceMappingURL=response-sync-offline.dto.js.map