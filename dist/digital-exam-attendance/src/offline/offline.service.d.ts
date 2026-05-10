import { DataSource } from 'typeorm';
import { SyncOfflineDto, SyncResult } from './dto/sync-offline.dto';
export declare class OfflineService {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    syncOfflineRecords(syncDto: SyncOfflineDto, userId: string): Promise<SyncResult>;
    private validateAndSyncRecord;
}
