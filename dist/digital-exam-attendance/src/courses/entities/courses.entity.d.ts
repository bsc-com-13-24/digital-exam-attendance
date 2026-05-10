import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
export declare class Course {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    creator_user: User;
    creator_id: string;
    created_by: string;
    created_at: Date;
    sessions: Session[];
}
