import { CreateRoomDto } from './create-room.dto';
declare const UpdateRoomDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRoomDto>>;
export declare class UpdateRoomDto extends UpdateRoomDto_base {
    room_code: string;
    name: string;
    building?: string;
    capacity: number;
    is_active: boolean;
    created_by?: string;
}
export {};
