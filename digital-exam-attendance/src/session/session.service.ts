import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createSession(dto: CreateSessionDto, userId: string): Promise<Session> {
    // 1. Get user name from database
    const user = await this.authService.getUserById(userId);
    const createdByName = '${ user.first_name } ${ user.last_name}';

    // 2. Map course_code to course_id
    const course = await this.coursesService.getCourseByCode(dto.course_code);

    // 3. Map venue (room code/name) to room_id
    const room = await this.roomsService.getRoomByCodeOrName(dto.venue);
    if (!room.is_active) {
      throw new BadRequestException(
        `Room "${room.name}" is not currently active`,
      );
    }

    // 4. Validate room capacity
    if (dto.expected_students) {
      if (dto.expected_students > room.capacity) {
        throw new BadRequestException(
          `Room "${room.name}" capacity (${room.capacity}) is less than expected students (${dto.expected_students})`,
        );
      }
    }

    // 5. Check for room schedule conflicts
    await this.checkRoomConflicts(
      room.id,
      new Date(dto.scheduled_start),
      new Date(dto.scheduled_end),
    );

    const session = this.sessionRepository.create({
      title: dto.title,
      venue: room.name,
      scheduled_start: dto.scheduled_start,
      scheduled_end: dto.scheduled_end,
      course_id: course.id,
      room_id: room.id,
      creator_id: userId,
      created_by: createdByName,
      expected_students: dto.expected_students,
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
        relations: ['course', 'room'],
        order: { scheduled_start: 'ASC' },
      });
    }
    return await this.sessionRepository.find({
      relations: ['course', 'room'],
      order: { scheduled_start: 'ASC' },
    });
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['course', 'room'],
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
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

    const updateData: any = { ...updateSessionDto };

    // Map course_code if provided
    if (updateSessionDto.course_code) {
      const course = await this.coursesService.getCourseByCode(updateSessionDto.course_code);
      updateData.course_id = course.id;
    }

    // Map venue if provided
    if (updateSessionDto.venue) {
      const room = await this.roomsService.getRoomByCodeOrName(updateSessionDto.venue);
      updateData.room_id = room.id;
      updateData.venue = room.name;

      // Validate capacity if expected_students is changing or venue is changing
      const students = updateSessionDto.expected_students || session.expected_students;
      if (students && students > room.capacity) {
        throw new BadRequestException(
          `Room "${room.name}" capacity (${room.capacity}) is less than expected students (${students})`,
        );
      }
    }

    // Check conflicts if times or venue are changing
    if (updateSessionDto.scheduled_start || updateSessionDto.scheduled_end || updateSessionDto.venue) {
      const roomId = updateData.room_id || session.room_id;
      const start = updateSessionDto.scheduled_start ? new Date(updateSessionDto.scheduled_start) : session.scheduled_start;
      const end = updateSessionDto.scheduled_end ? new Date(updateSessionDto.scheduled_end) : session.scheduled_end;

      await this.checkRoomConflicts(roomId, start, end, id);
    }

    await this.sessionRepository.update(id, updateData);
    return await this.getSessionById(id);
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
