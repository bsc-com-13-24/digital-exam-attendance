export declare class OfflineSyncErrorDto {
    localId: string;
    reason: string;
}
export declare class SyncResultDto {
    successCount: number;
    failureCount: number;
    failures: OfflineSyncErrorDto[];
}
export declare class OfflineSyncResponseDto {
    success: boolean;
    message: string;
    data: SyncResultDto;
}
