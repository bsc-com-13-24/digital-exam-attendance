import { RoomsService } from './rooms.service';
import { Room } from './entities/rooms.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom(dto: CreateRoomDto, req: any): Promise<Room>;
    getAllRooms(activeOnly?: string): Promise<Room[]>;
    getRoomById(roomId: string): Promise<Room>;
    getRoomByCode(roomCode: string): Promise<Room>;
    getSessionsByRoom(roomId: string): Promise<Room>;
    updateRoom(roomId: string, dto: UpdateRoomDto, req: any): Promise<Room>;
    deleteRoom(roomId: string, req: any): Promise<{
        message: string;
    }>;
}
