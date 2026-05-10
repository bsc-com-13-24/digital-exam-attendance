import { OfflineService } from './offline.service';
import { SyncOfflineDto } from './dto/sync-offline.dto';
export declare class OfflineController {
    private readonly offlineService;
    private readonly logger;
    constructor(offlineService: OfflineService);
    syncOfflineRecords(syncDto: SyncOfflineDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./dto/sync-offline.dto").SyncResult;
    }>;
}
