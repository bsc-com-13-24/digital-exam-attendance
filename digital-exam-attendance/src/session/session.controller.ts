import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/sessions.entity';
import { Course } from './entities/courses.entity';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post()
  async create(@Body() dto: CreateSessionDto): Promise<Session> {
    return await this.sessionService.createSession(dto);
  }

  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionService.getAllSessions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Session> {
    return await this.sessionService.getSessionById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateSessionDto) {
    return this.sessionService.updateSession(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.removeSession(id);
  }
}
