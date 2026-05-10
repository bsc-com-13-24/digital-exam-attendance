import { Repository } from 'typeorm';
import { Session } from '../session/entities/sessions.entity';
<<<<<<< HEAD
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
=======
import { AttendanceRecord } from "../../../src/attendance/entities/attendance-records.entity";
import { SessionStudent } from "../../../src/session/entities/session-students.entity";
>>>>>>> e61f5395b1872702d9047eb369344b7689e2169a
export declare class DashboardService {
    private readonly sessionRepository;
    private readonly attendanceRepository;
    private readonly sessionStudentRepository;
    constructor(sessionRepository: Repository<Session>, attendanceRepository: Repository<AttendanceRecord>, sessionStudentRepository: Repository<SessionStudent>);
    getActiveSessions(): Promise<number>;
    getUpcomingSessions(): Promise<number>;
    getExpiredSessions(): Promise<number>;
    countRegisteredStudents(sessionId: string): Promise<number>;
    countActualAttendees(sessionId: string): Promise<number>;
    getAttendanceReport(sessionId: string): Promise<{
        totalEnrolled: number;
        present: number;
        absent: number;
        late: number;
        completed: number;
    }>;
    private findCount;
}
