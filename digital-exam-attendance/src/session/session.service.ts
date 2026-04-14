import { Injectable } from '@nestjs/common';
import { Session } from './session.entity';
import { CreateSessionDto } from './create-session.dto';

@Injectable()
export class SessionService {
    private sessions: Session[] = [];

  createSession(dto: CreateSessionDto): Session {
    const session = new Session(
      dto.title,
      dto.course_id,
      dto.venue,
      dto.start,
      dto.end,
      dto.notes
    );

    this.sessions.push(session);
    return session;
  }

  getAllSessions(): Session[] {
    return this.sessions;
  }

  getSessionById(id: number): Session | string {
    const session = this.sessions[id];
    if (!session) {
      return 'Session not found';
    }
    return session;
  }
}
