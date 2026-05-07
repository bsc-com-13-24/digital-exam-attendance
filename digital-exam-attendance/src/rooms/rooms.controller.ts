import { Controller, Post, Body, Param, Get, Patch, Delete, UseGuards, Request, Query, ParseUUIDPipe, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomsService } from './rooms.service';
import { Room } from './entities/rooms.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('rooms')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Roles('admin')
  @Post()
  async createRoom(
    @Body() dto: CreateRoomDto,
    @Request() req,
  ): Promise<Room> {
    return await this.roomsService.createRoom(dto, req.user.userId);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get()
  async getAllRooms(
    @Query('activeOnly') activeOnly?: string,
  ): Promise<Room[]> {
    return await this.roomsService.getAllRooms(activeOnly === 'true');
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get(':roomId')
  async getRoomById(
    @Param('roomId', ParseUUIDPipe) roomId: string,
  ): Promise<Room> {
    return await this.roomsService.getRoomById(roomId);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get('code/:roomCode')
  async getRoomByCode(
    @Param('roomCode') roomCode: string,
  ): Promise<Room> {
    return await this.roomsService.getRoomByCode(roomCode);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get(':roomId/sessions')
  async getSessionsByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
  ): Promise<Room> {
    return await this.roomsService.getSessionsByRoom(roomId);
  }

  @Roles('admin')
  @Patch(':roomId')
  async updateRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() dto: UpdateRoomDto,
    @Request() req,
  ): Promise<Room> {
    return await this.roomsService.updateRoom(roomId, dto, req.user.userId);
  }

  @Roles('admin')
  @Delete(':roomId')
  async deleteRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.roomsService.deleteRoom(roomId, req.user.userId);
  }
}
