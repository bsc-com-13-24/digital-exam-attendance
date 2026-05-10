export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late"
}
export declare enum ScanMethod {
    SCAN = "scan",
    MANUAL = "manual"
}
export declare class OfflineRecordRequestDto {
    localId: string;
    sessionId: string;
    studentId: string;
    status: AttendanceStatus;
    method: ScanMethod;
    markedAt: string;
    remarks?: string;
}
