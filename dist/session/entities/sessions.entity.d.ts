import { Course } from '../../courses/entities/courses.entity';
import { SessionStudent } from './session-students.entity';
import { AttendanceRecord } from '../../attendance/entities/attendance-records.entity';
import { User } from '../../auth/entities/users.entity';
import { Room } from '../../rooms/entities/rooms.entity';
export declare class Session {
    id: string;
    title: string;
    venue: string;
    scheduled_start: Date;
    scheduled_end: Date;
    status: string;
    course: Course;
    course_id: string;
    room: Room;
    room_id: string;
    created_by_user: User;
    created_by: string;
    created_at: Date;
    students: SessionStudent[];
    attendance_records: AttendanceRecord[];
}
