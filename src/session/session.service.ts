import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Session } from './entities/sessions.entity';
import { Course } from '../courses/entities/courses.entity';
import { SessionStudent } from './entities/session-students.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,

    private readonly roomsService: RoomsService,
  ) {}

  async createSession(dto: CreateSessionDto, userId: string): Promise<Session> {
    const { course_ids, ...rest } = dto;

    // Validate room if provided
    if (dto.room_id) {
      const room = await this.roomsService.getRoomById(dto.room_id);
      if (!room.is_active) {
        throw new BadRequestException(
          `Room "${room.name}" is not currently active`,
        );
      }
    }

    const session = this.sessionRepository.create({
      ...rest,
      created_by: userId,
      courses: course_ids.map((id) => ({ id } as Course)),
    });
    return await this.sessionRepository.save(session);
  }


  async getAllSessions(status?: string): Promise<Session[]> {
    if (status) {
      return await this.sessionRepository.find({
        where: { status },
        relations: ['courses', 'room'],
        order: { scheduled_start: 'ASC' },
      });
    }
    return await this.sessionRepository.find({
      relations: ['courses', 'room'],
      order: { scheduled_start: 'ASC' },
    });
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['courses', 'room'],
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async getSessionByStatus(status: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { status },
      relations: ['courses', 'room'],
      order: { scheduled_start: 'ASC' },
    });
  }

  async updateSession(
    id: string,
    updateSessionDto: UpdateSessionDto,
    userId: string,
  ): Promise<Session> {
    const session = await this.getSessionById(id);
    if (session.created_by !== userId) {
      throw new ForbiddenException('You can only update sessions you created');
    }

    const { course_ids, ...rest } = updateSessionDto;

    if (course_ids) {
      session.courses = course_ids.map((cid) => ({ id: cid } as Course));
    }

    Object.assign(session, rest);

    return await this.sessionRepository.save(session);
  }

  async removeSession(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const session = await this.getSessionById(id);
    if (session.created_by !== userId) {
      throw new ForbiddenException('You can only delete sessions you created');
    }
    await this.sessionRepository.delete(id);
    return { message: `Session ${id} deleted successfully` };
  }

  // Alias used by the controller
  async deleteSession(id: string, userId: string): Promise<{ message: string }> {
    return this.removeSession(id, userId);
  }

  // enrollment logic
  async enrollStudents(
    sessionId: string,
    dto: EnrollStudentsDto,
  ): Promise<SessionStudent[]> {
    const session = await this.getSessionById(sessionId);

    // bulk process
    const enrollments: SessionStudent[] = [];
    for (const studentDto of dto.students) {
      // avoid duplicates
      const existing = await this.sessionStudentRepository.findOne({
        where: {
          session_id: sessionId,
          student_number: studentDto.student_number,
        },
      });

      if (!existing) {
        const enrollment = this.sessionStudentRepository.create({
          session_id: sessionId,
          student_number: studentDto.student_number,
          full_name: studentDto.full_name,
        });
        enrollments.push(enrollment);
      }
    }

    if (enrollments.length > 0) {
      return await this.sessionStudentRepository.save(enrollments);
    }

    // fallback to existing
    return await this.getStudentsBySessionId(sessionId);
  }

  async getStudentsBySessionId(sessionId: string): Promise<SessionStudent[]> {
    return await this.sessionStudentRepository.find({
      where: { session_id: sessionId },
    });
  }

  // Alias used by the controller
  async getStudentsInSession(sessionId: string): Promise<SessionStudent[]> {
    return this.getStudentsBySessionId(sessionId);
  }
}
