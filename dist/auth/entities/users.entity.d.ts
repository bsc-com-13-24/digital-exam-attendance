import { UserRole } from './user-roles.entity';
export declare class User {
    id: string;
    staff_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    created_at: Date;
    roles: UserRole[];
}
