import { CreateCourseDto } from './create-course.dto';
declare const UpdateCourseDto_base: import("@nestjs/common").Type<Partial<CreateCourseDto>>;
export declare class UpdateCourseDto extends UpdateCourseDto_base {
    code?: string;
    name?: string;
    is_active?: boolean;
}
export {};
