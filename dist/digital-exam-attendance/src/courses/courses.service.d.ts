import { Repository } from 'typeorm';
import { Course } from '../courses/entities/courses.entity';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private readonly courseRepository;
    constructor(courseRepository: Repository<Course>);
    createCourse(createCourseDto: CreateCourseDto, userId: string, fullName: string): Promise<Course>;
    getAllCourse(): Promise<Course[]>;
    getCourseById(id: string): Promise<Course>;
    getCourseByCode(code: string): Promise<Course>;
    updateCourse(id: string, updateCourseDto: UpdateCourseDto, userId: string): Promise<Course>;
    removeCourse(id: string, userId: string): Promise<{
        message: string;
    }>;
    deleteCourse(id: string, userId: string): Promise<{
        message: string;
    }>;
    getAllCourses(): Promise<Course[]>;
}
