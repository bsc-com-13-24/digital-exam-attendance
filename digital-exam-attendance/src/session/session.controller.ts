import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/sessions.entity';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // CREATE SESSION
  @Post()
  async create(@Body() dto: CreateSessionDto): Promise<Session> {
    return await this.sessionService.createSession(dto);
  }

  // GET ALL SESSIONS
  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionService.getAllSessions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Session> {
    return await this.sessionService.getSessionById(id);
  }
}
