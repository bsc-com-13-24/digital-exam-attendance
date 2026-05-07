import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Course} from './entities/courses.entity'
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('courses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  //  COURSE ENDPOINTS  -> /course/
 
   @Roles('admin', 'teacher')
   @Post()
   async createCourse(
     @Body() dto: CreateCourseDto,
     @Request() req,
   ): Promise<Course> {
     return await this.coursesService.createCourse(dto, req.user.userId);
   }
 
   @Roles('admin', 'teacher', 'invigilator')
   @Get()
   async getAllCourses(): Promise<Course[]> {
     return await this.coursesService.getAllCourses();
   }
 
   @Roles('admin', 'teacher', 'invigilator')
   @Get(':courseId')
   async getCourseById(
     @Param('courseId', ParseUUIDPipe) courseId: string,
   ): Promise<Course> {
     return await this.coursesService.getCourseById(courseId);
   }
 
   @Roles('admin', 'teacher')
   @Patch(':courseId')
   async updateCourse(
     @Param('courseId', ParseUUIDPipe) courseId: string,
     @Body() dto: UpdateCourseDto,
     @Request() req,
   ): Promise<Course> {
     return await this.coursesService.updateCourse(courseId, dto, req.user.userId);
   }
  
   @Roles('admin', 'teacher')
   @Delete(':courseId')
   async deleteCourse(
     @Param('courseId', ParseUUIDPipe) courseId: string,
     @Request() req,
   ): Promise<{ message: string }> {
     return await this.coursesService.deleteCourse(courseId, req.user.userId);
   }
 
}
