import { Repository, DataSource } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { SyncOfflineDto, SyncResult } from './dto/sync-offline.dto';
export declare class OfflineService {
    private attendanceRepo;
    private sessionStudentRepo;
    private sessionRepo;
    private dataSource;
    private readonly logger;
    constructor(attendanceRepo: Repository<AttendanceRecord>, sessionStudentRepo: Repository<SessionStudent>, sessionRepo: Repository<Session>, dataSource: DataSource);
    syncOfflineRecords(syncDto: SyncOfflineDto, userId: string): Promise<SyncResult>;
    private validateAndSyncRecord;
}
