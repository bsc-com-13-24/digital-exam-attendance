import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly sessionStudentRepository: Repository<SessionStudent>
  ) { }

  //SESSION CRUD
  async createSession(dto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(dto);
    return await this.sessionRepository.save(session);
  }

  async getAllSessions(): Promise<Session[]> {
    return await this.sessionRepository.find();
  }

  async getSessionById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id }
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async updateSession(id: string, updateSessionDto: UpdateSessionDto): Promise<Session> {
    await this.getSessionById(id);
    await this.sessionRepository.update(id, updateSessionDto);
    return await this.getSessionById(id);
  }

  async removeSession(id: string): Promise<{ message: string }> {
    await this.getSessionById(id);
    await this.sessionRepository.delete(id);
    return { message: `Session ${id} deleted successfully` };
  }

  //COURSE CRUD
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
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

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.getCourseById(id);
    await this.courseRepository.update(id, updateCourseDto);
    return await this.getCourseById(id);
  }

  async removeCourse(id: string): Promise<{ message: string }> {
    await this.getCourseById(id);
    await this.courseRepository.delete(id);
    return { message: `Course ${id} deleted successfully` };
  }
}
