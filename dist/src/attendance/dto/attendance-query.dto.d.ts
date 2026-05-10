import { AttendanceStatus } from '../entities/attendance-records.entity';
export declare class AttendanceQueryDto {
    session_id?: string;
    student_number?: string;
    status?: AttendanceStatus;
    method?: string;
    course_id?: string;
}
