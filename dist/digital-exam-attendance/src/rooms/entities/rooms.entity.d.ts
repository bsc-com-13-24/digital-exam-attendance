import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
export declare class Room {
    id: string;
    room_code: string;
    name: string;
    building: string;
    capacity: number;
    is_active: boolean;
    creator_user: User;
    creator_id: string;
    created_by: string;
    created_at: Date;
    sessions: Session[];
}
