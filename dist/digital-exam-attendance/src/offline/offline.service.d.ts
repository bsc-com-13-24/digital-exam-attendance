import { DataSource, Repository } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { Session } from '../session/entities/sessions.entity';
import { SyncOfflineDto, SyncResult } from './dto/sync-offline.dto';
export declare class OfflineService {
    private dataSource;
    private readonly sessionRepo;
    private readonly attendanceRepo;
    private readonly logger;
    constructor(dataSource: DataSource, sessionRepo: Repository<Session>, attendanceRepo: Repository<AttendanceRecord>);
    syncOfflineRecords(syncDto: SyncOfflineDto, userId: string): Promise<SyncResult>;
    private validateAndSyncRecord;
    private getServerUpdates;
}
