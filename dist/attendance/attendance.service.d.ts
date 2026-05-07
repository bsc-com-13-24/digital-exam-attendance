import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-records.entity';
import { AuditLog } from './entities/audit-logs.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
export declare class AttendanceService {
    private readonly attendanceRepository;
    private readonly auditLogRepository;
    private readonly sessionStudentRepository;
    private readonly sessionRepository;
    constructor(attendanceRepository: Repository<AttendanceRecord>, auditLogRepository: Repository<AuditLog>, sessionStudentRepository: Repository<SessionStudent>, sessionRepository: Repository<Session>);
    markAttendance(dto: CreateAttendanceDto, userId: string): Promise<AttendanceRecord>;
    bulkMarkAttendance(dto: BulkMarkAttendanceDto, userId: string): Promise<AttendanceRecord[]>;
    updateAttendance(id: string, dto: UpdateAttendanceDto, updatedBy?: string): Promise<AttendanceRecord>;
    getAttendanceRecords(query: AttendanceQueryDto): Promise<AttendanceRecord[]>;
    searchStudentsForManualMark(sessionId: string, search: string): Promise<SessionStudent[]>;
    private logAudit;
}
