import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/courses.entity';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) { }

  async createCourse(
    createCourseDto: CreateCourseDto,
    userId: string,
    fullName: string,
  ): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      creator_id: userId,
      created_by: fullName,
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

  async getCourseByCode(code: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { code } });
    if (!course) {
      throw new NotFoundException(`Course with code "${code}" not found`);
    }
    return course;
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<Course> {
    const course = await this.getCourseById(id);
    if (course.creator_id !== userId) {
      throw new ForbiddenException('You can only update courses you created');
    }
    await this.courseRepository.update(id, updateCourseDto);
    return await this.getCourseById(id);
  }

  async removeCourse(id: string, userId: string): Promise<{ message: string }> {
    const course = await this.getCourseById(id);
    if (course.creator_id !== userId) {
      throw new ForbiddenException('You can only delete courses you created');
    }
    await this.courseRepository.delete(id);
    return { message: `Course ${id} deleted successfully` };
  }

  async deleteCourse(id: string, userId: string): Promise<{ message: string }> {
    return this.removeCourse(id, userId);
  }

  async getAllCourses(): Promise<Course[]> {
    return this.getAllCourse();
  }
}
