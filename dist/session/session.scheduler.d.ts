import { Repository } from "typeorm";
import { Session } from './entities/sessions.entity';
export declare class SessionSchedulerService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<Session>);
    updateSessionStatuses(): Promise<void>;
}
