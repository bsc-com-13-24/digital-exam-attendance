import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/rooms.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SessionStudent } from '../session/entities/session-students.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';

@Injectable()
export class RoomsService {
  
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
  ) {}

  async createRoom(
    dto: CreateRoomDto,
    userId: string,
    fullName: string,
  ): Promise<Room> {
    const existing = await this.roomRepository.findOne({
      where: { room_code: dto.room_code },
    });
    if (existing) {
      throw new ConflictException(
        `Room with code "${dto.room_code}" already exists`,
      );
    }

    const room = this.roomRepository.create({
      ...dto,
      creator_id: userId,
      created_by: fullName,
    });
    return await this.roomRepository.save(room);
  }

  async getAllRooms(activeOnly?: boolean): Promise<Room[]> {
    if (activeOnly) {
      return await this.roomRepository.find({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    }
    return await this.roomRepository.find({ order: { name: 'ASC' } });
  }

  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async getRoomByCode(roomCode: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { room_code: roomCode },
    });
    if (!room) {
      throw new NotFoundException(
        `Room with code "${roomCode}" not found`,
      );
    }
    return room;
  }

  async updateRoom(
    id: string,
    dto: UpdateRoomDto,
    userId: string,
  ): Promise<Room> {
    const room = await this.getRoomById(id);
    if (room.creator_id !== userId) {
      throw new ForbiddenException('You can only update rooms you created');
    }
    await this.roomRepository.update(id, dto);
    return await this.getRoomById(id);
  }

  async deleteRoom(id: string, userId: string): Promise<{ message: string }> {
    const room = await this.getRoomById(id);
    if (room.creator_id !== userId) {
      throw new ForbiddenException('You can only delete rooms you created');
    }
    await this.roomRepository.delete(id);
    return { message: `Room ${id} deleted successfully` };
  }

  async getSessionsByRoom(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['sessions', 'sessions.courses'],
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    return room;
  }

  async verifyStudentInRoom(sessionId: string, roomCode: string, studentId: string) {
    const room = await this.roomRepository.findOne({ where: { room_code: roomCode } });
    if (!room) {
      return { valid: false, message: 'Invalid room code' };
    }

    const enrollment = await this.sessionStudentRepository.findOne({
      where: { session_id: sessionId, student_number: studentId }
    });

    if (!enrollment) {
      return { valid: false, message: 'Student not enrolled in this session' };
    }

    return {
      valid: true,
      room: {
        id: room.id,
        name: room.name,
        building: room.building,
        room_code: room.room_code
      }
    };
  }
}
