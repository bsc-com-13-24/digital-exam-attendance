import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
export declare class Course {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    created_by_user: User;
    created_by: string;
    created_at: Date;
    sessions: Session[];
}
