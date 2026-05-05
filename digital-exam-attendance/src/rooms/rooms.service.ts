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

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createRoom(dto: CreateRoomDto, userId: string): Promise<Room> {
    // Check for duplicate room code
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
      created_by: userId,
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
    if (room.created_by !== userId) {
      throw new ForbiddenException('You can only update rooms you created');
    }
    await this.roomRepository.update(id, dto);
    return await this.getRoomById(id);
  }

  async deleteRoom(id: string, userId: string): Promise<{ message: string }> {
    const room = await this.getRoomById(id);
    if (room.created_by !== userId) {
      throw new ForbiddenException('You can only delete rooms you created');
    }
    await this.roomRepository.delete(id);
    return { message: `Room ${id} deleted successfully` };
  }

  async getSessionsByRoom(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['sessions', 'sessions.course'],
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    return room;
  }
}
