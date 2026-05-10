import { Repository } from 'typeorm';
import { Session } from '../session/entities/sessions.entity';
import { AttendanceRecord } from "../../../src/attendance/entities/attendance-records.entity";
import { SessionStudent } from "../../../src/session/entities/session-students.entity";
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
