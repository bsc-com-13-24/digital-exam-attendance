import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/sessions.entity';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) { }

  async createSession(dto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(dto);
    return await this.sessionRepository.save(session);
  }

  async getAllSessions(): Promise<Session[]> {
    return await this.sessionRepository.find({ relations: ['course', 'created_by_user'] });
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['course', 'created_by_user'],
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }
}
