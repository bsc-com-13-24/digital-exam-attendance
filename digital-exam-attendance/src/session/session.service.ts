import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
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
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/users.entity'

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,

    private readonly roomsService: RoomsService,
    private readonly coursesService: CoursesService,
    private readonly authService: AuthService,
  ) { }

  async createSession(
    dto: CreateSessionDto,
    userId: string,
    fullName: string,
  ): Promise<Session> {
    const { course_codes, room_code, ...rest } = dto;

    const courses: Course[] = [];
    for (const code of course_codes) {
      const course = await this.coursesService.getCourseByCode(code);
      courses.push(course);
    }

    const room = await this.roomsService.getRoomByCode(room_code);
    if (!room.is_active) {
      throw new BadRequestException(
        `Room "${room.name}" is not currently active`,
      );
    }

    if (dto.expected_students) {
      if (dto.expected_students > room.capacity) {
        throw new BadRequestException(
          `Room "${room.name}" capacity (${room.capacity}) is less than expected students (${dto.expected_students})`,
        );
      }
    }

    await this.checkRoomConflicts(
      room.id,
      new Date(dto.scheduled_start),
      new Date(dto.scheduled_end),
    );

    const session = this.sessionRepository.create({
      ...rest,
      creator_id: userId,
      created_by: fullName,
      courses: courses,
      room: room,
      room_id: room.id,
    });

    return await this.sessionRepository.save(session);
  }

  private async checkRoomConflicts(
    roomId: string,
    start: Date,
    end: Date,
    excludeSessionId?: string,
  ): Promise<void> {
    const query = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.room_id = :roomId', { roomId })
      .andWhere('session.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere(
        '(session.scheduled_start < :end AND session.scheduled_end > :start)',
        { start, end },
      );

    if (excludeSessionId) {
      query.andWhere('session.id != :excludeSessionId', { excludeSessionId });
    }

    const conflict = await query.getOne();

    if (conflict) {
      throw new ConflictException(
        `Room is already booked for session "${conflict.title}" during this time`,
      );
    }
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
    if (session.creator_id !== userId) {
      throw new ForbiddenException('You can only update sessions you created');
    }

    const { course_codes, room_code, ...rest } = updateSessionDto;

    if (course_codes) {
      const courses: Course[] = [];
      for (const code of course_codes) {
        const course = await this.coursesService.getCourseByCode(code);
        courses.push(course);
      }
      session.courses = courses;
    }

    if (room_code) {
      const room = await this.roomsService.getRoomByCode(room_code);
      if (!room.is_active) {
        throw new BadRequestException(
          `Room "${room.name}" is not currently active`,
        );
      }
      session.room = room;
      session.room_id = room.id;
    }

    if (updateSessionDto.venue) {
      const room = await this.roomsService.getRoomByCodeOrName(updateSessionDto.venue);
      session.room = room;
      session.room_id = room.id;
      session.venue = room.name;
    }

    Object.assign(session, rest);

    return await this.sessionRepository.save(session);
  }

  async removeSession(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const session = await this.getSessionById(id);
    if (session.creator_id !== userId) {
      throw new ForbiddenException('You can only delete sessions you created');
    }
    await this.sessionRepository.delete(id);
    return { message: `Session ${id} deleted successfully` };
  }

  async deleteSession(id: string, userId: string): Promise<{ message: string }> {
    return this.removeSession(id, userId);
  }

  async enrollStudents(
    sessionId: string,
    dto: EnrollStudentsDto,
  ): Promise<SessionStudent[]> {
    const session = await this.getSessionById(sessionId);

    const enrollments: SessionStudent[] = [];
    for (const studentDto of dto.students) {
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

    return await this.getStudentsBySessionId(sessionId);
  }

  async getStudentsBySessionId(sessionId: string): Promise<SessionStudent[]> {
    return await this.sessionStudentRepository.find({
      where: { session_id: sessionId },
    });
  }

  async getStudentsInSession(sessionId: string): Promise<SessionStudent[]> {
    return this.getStudentsBySessionId(sessionId);
  }
}
