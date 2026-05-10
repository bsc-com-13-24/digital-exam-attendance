import { Repository } from 'typeorm';
import { Room } from './entities/rooms.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SessionStudent } from '../session/entities/session-students.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
export declare class RoomsService {
    private readonly roomRepository;
    private readonly sessionStudentRepository;
    private readonly attendanceRepository;
    constructor(roomRepository: Repository<Room>, sessionStudentRepository: Repository<SessionStudent>, attendanceRepository: Repository<AttendanceRecord>);
    createRoom(dto: CreateRoomDto, userId: string, fullName: string): Promise<Room>;
    getAllRooms(activeOnly?: boolean): Promise<Room[]>;
    getRoomById(id: string): Promise<Room>;
    getRoomByCode(roomCode: string): Promise<Room>;
    getRoomByCodeOrName(identifier: string): Promise<Room>;
    updateRoom(id: string, dto: UpdateRoomDto, userId: string): Promise<Room>;
    deleteRoom(id: string, userId: string): Promise<{
        message: string;
    }>;
    getSessionsByRoom(roomId: string): Promise<Room>;
    verifyStudentInRoom(sessionId: string, roomCode: string, studentId: string): Promise<{
        valid: boolean;
        message: string;
        room?: undefined;
    } | {
        valid: boolean;
        room: {
            id: string;
            name: string;
            building: string;
            room_code: string;
        };
        message?: undefined;
    }>;
}
