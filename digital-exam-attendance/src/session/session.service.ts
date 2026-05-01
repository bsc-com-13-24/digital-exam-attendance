import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/sessions.entity';
import { Course } from './entities/courses.entity';
import { SessionStudent } from './entities/session-students.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { AddStudentDto } from './dto/add-student.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,
  ) {}

  async createSession(dto: CreateSessionDto, userId: string): Promise<Session> {
    const session = this.sessionRepository.create({
      ...dto,
      created_by: userId,
    });
    return await this.sessionRepository.save(session);
  }

  async getAllSessions(status?: string): Promise<Session[]> {
    if (status) {
      return await this.sessionRepository.find({
        where: { status },
        relations: ['course'],
        order: { scheduled_start: 'ASC' },
      });
    }
    return await this.sessionRepository.find({ order: { scheduled_start: 'ASC' } });
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async getSessionByStatus(status: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { status },
      relations: ['course'],
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
    await this.sessionRepository.update(id, updateSessionDto);
    return await this.getSessionById(id);
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

  async createCourse(
    createCourseDto: CreateCourseDto,
    userId: string,
  ): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      created_by: userId,
    });
    return await this.courseRepository.save(course);
  }

  async getAllCourse(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<Course> {
    const course = await this.getCourseById(id);
    if (course.created_by !== userId) {
      throw new ForbiddenException('You can only update courses you created');
    }
    await this.courseRepository.update(id, updateCourseDto);
    return await this.getCourseById(id);
  }

  async removeCourse(id: string, userId: string): Promise<{ message: string }> {
    const course = await this.getCourseById(id);
    if (course.created_by !== userId) {
      throw new ForbiddenException('You can only delete courses you created');
    }
    await this.courseRepository.delete(id);
    return { message: `Course ${id} deleted successfully` };
  }

  // Aliases used by the controller
  async deleteCourse(id: string, userId: string): Promise<{ message: string }> {
    return this.removeCourse(id, userId);
  }

  async getAllCourses(): Promise<Course[]> {
    return this.getAllCourse();
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
