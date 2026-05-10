import { Repository } from 'typeorm';
import { Session } from './entities/sessions.entity';
import { SessionStudent } from './entities/session-students.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';
import { RoomsService } from '../rooms/rooms.service';
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../auth/auth.service';
export declare class SessionService {
    private readonly sessionRepository;
    private readonly sessionStudentRepository;
    private readonly roomsService;
    private readonly coursesService;
    private readonly authService;
    constructor(sessionRepository: Repository<Session>, sessionStudentRepository: Repository<SessionStudent>, roomsService: RoomsService, coursesService: CoursesService, authService: AuthService);
    createSession(dto: CreateSessionDto, userId: string, fullName: string): Promise<Session>;
    private checkRoomConflicts;
    getAllSessions(status?: string): Promise<Session[]>;
    getSessionById(id: string): Promise<Session>;
    getSessionByStatus(status: string): Promise<Session[]>;
    updateSession(id: string, updateSessionDto: UpdateSessionDto, userId: string): Promise<Session>;
    removeSession(id: string, userId: string): Promise<{
        message: string;
    }>;
    deleteSession(id: string, userId: string): Promise<{
        message: string;
    }>;
    enrollStudents(sessionId: string, dto: EnrollStudentsDto): Promise<SessionStudent[]>;
    getStudentsBySessionId(sessionId: string): Promise<SessionStudent[]>;
    getStudentsInSession(sessionId: string): Promise<SessionStudent[]>;
}
