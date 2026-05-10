import { Course } from './entities/courses.entity';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(dto: CreateCourseDto, req: any): Promise<Course>;
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course>;
    updateCourse(courseId: string, dto: UpdateCourseDto, req: any): Promise<Course>;
    deleteCourse(courseId: string, req: any): Promise<{
        message: string;
    }>;
}
