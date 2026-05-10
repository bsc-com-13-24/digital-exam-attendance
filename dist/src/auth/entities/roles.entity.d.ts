import { UserRole } from './user-roles.entity';
export declare class Role {
    id: string;
    name: string;
    display_name: string;
    user_roles: UserRole[];
}
