import { User } from './users.entity';
import { Role } from './roles.entity';
export declare class UserRole {
    user_id: string;
    role_id: string;
    user: User;
    role: Role;
    assigned_at: Date;
}
