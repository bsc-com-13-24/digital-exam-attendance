import { AttendanceStatus } from '../entities/attendance-records.entity';
export declare class CreateAttendanceDto {
    session_id: string;
    student_number: string;
    status: AttendanceStatus;
    method: string;
    remarks?: string;
    marked_by?: string;
}
