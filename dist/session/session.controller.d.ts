import { SessionService } from './session.service';
import { Session } from './entities/sessions.entity';
import { SessionStudent } from './entities/session-students.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    createSession(dto: CreateSessionDto, req: any): Promise<Session>;
    getSessions(status?: string): Promise<Session[]>;
    getSessionById(sessionId: string): Promise<Session>;
    getEnrolledStudents(sessionId: string): Promise<SessionStudent[]>;
    enrollStudents(sessionId: string, dto: EnrollStudentsDto): Promise<SessionStudent[]>;
    updateSession(sessionId: string, dto: UpdateSessionDto, req: any): Promise<Session>;
    deleteSession(sessionId: string, req: any): Promise<{
        message: string;
    }>;
}
