"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const courses_entity_1 = require("../courses/entities/courses.entity");
let CoursesService = class CoursesService {
    courseRepository;
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    async createCourse(createCourseDto, userId) {
        const course = this.courseRepository.create({
            ...createCourseDto,
            created_by: userId,
        });
        return await this.courseRepository.save(course);
    }
    async getAllCourse() {
        return await this.courseRepository.find();
    }
    async getCourseById(id) {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    async updateCourse(id, updateCourseDto, userId) {
        const course = await this.getCourseById(id);
        if (course.created_by !== userId) {
            throw new common_1.ForbiddenException('You can only update courses you created');
        }
        await this.courseRepository.update(id, updateCourseDto);
        return await this.getCourseById(id);
    }
    async removeCourse(id, userId) {
        const course = await this.getCourseById(id);
        if (course.created_by !== userId) {
            throw new common_1.ForbiddenException('You can only delete courses you created');
        }
        await this.courseRepository.delete(id);
        return { message: `Course ${id} deleted successfully` };
    }
    async deleteCourse(id, userId) {
        return this.removeCourse(id, userId);
    }
    async getAllCourses() {
        return this.getAllCourse();
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(courses_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map