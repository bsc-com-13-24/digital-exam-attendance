import { AttendanceStatus } from '../../attendance/entities/attendance-records.entity';
export declare enum ScanMethod {
    SCAN = "scan",
    MANUAL = "manual"
}
export interface SyncResult {
    successCount: number;
    failureCount: number;
    failures: Array<{
        localId: string;
        code?: string;
        reason: string;
    }>;
    serverUpdates?: any[];
}
export declare class OfflineAttendanceRecordDto {
    localId: string;
    sessionId: string;
    studentNumber: string;
    status: AttendanceStatus;
    method: ScanMethod;
    markedAt: string;
    remarks?: string;
}
export declare class SyncOfflineDto {
    deviceId: string;
    offlineRecords: OfflineAttendanceRecordDto[];
    lastSyncTimestamp?: string;
}
