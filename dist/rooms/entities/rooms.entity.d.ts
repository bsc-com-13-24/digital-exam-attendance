import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
export declare class Room {
    id: string;
    room_code: string;
    name: string;
    building: string;
    capacity: number;
    is_active: boolean;
    created_by_user: User;
    created_by: string;
    created_at: Date;
    sessions: Session[];
}
