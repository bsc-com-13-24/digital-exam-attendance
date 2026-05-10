import { User } from '../../auth/entities/users.entity';
export declare class AuditLog {
    id: string;
    user: User;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    created_at: Date;
}
