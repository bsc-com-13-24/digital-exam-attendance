import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
import { SessionStudent } from '../../session/entities/session-students.entity';
export declare enum AttendanceStatus {
    PRESENT = "present",
    LATE = "late",
    ABSENT = "absent",
    COMPLETED = "completed"
}
export declare class AttendanceRecord {
    id: string;
    session: Session;
    session_id: string;
    session_student: SessionStudent;
    session_student_id: string;
    status: AttendanceStatus;
    marked_by_user: User;
    marked_by?: string | null;
    marked_at?: Date | null;
    method?: string | null;
    remarks?: string | null;
    created_at: Date;
    updated_at: Date;
}
