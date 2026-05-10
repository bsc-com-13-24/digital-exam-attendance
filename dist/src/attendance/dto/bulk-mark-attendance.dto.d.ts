import { CreateAttendanceDto } from './create-attendance.dto';
export declare class BulkMarkAttendanceDto {
    session_id: string;
    records: CreateAttendanceDto[];
}
