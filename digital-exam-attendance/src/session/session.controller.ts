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
import { SessionService } from './session.service';
import { Session } from './entities/sessions.entity';
import { Course } from './entities/courses.entity';
import { SessionStudent } from './entities/session-students.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
  SessionController handles all HTTP requests under /api/v1/session.
 
  Everything here requires a valid JWT token. Role-based guards
  then further restrict which users can do what.
 */
@Controller('session')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  //  COURSE ENDPOINTS  -> /session/course

  @Roles('admin', 'teacher')
  @Post('course')
  async createCourse(
    @Body() dto: CreateCourseDto,
    @Request() req,
  ): Promise<Course> {
    return await this.sessionService.createCourse(dto, req.user.userId);
  }



  @Roles('admin', 'teacher', 'invigilator')
  @Get('course')
  async getAllCourses(): Promise<Course[]> {
    return await this.sessionService.getAllCourses();
  }



  @Roles('admin', 'teacher', 'invigilator')
  @Get('course/:courseId')
  async getCourseById(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Course> {
    return await this.sessionService.getCourseById(courseId);
  }



  @Roles('admin', 'teacher')
  @Patch('course/:courseId')
  async updateCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() dto: UpdateCourseDto,
    @Request() req,
  ): Promise<Course> {
    return await this.sessionService.updateCourse(courseId, dto, req.user.userId);
  }


  @Roles('admin', 'teacher')
  @Delete('course/:courseId')
  async deleteCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.sessionService.deleteCourse(courseId, req.user.userId);
  }


  //  SESSION ENDPOINTS  ->  /session

  @Roles('admin', 'teacher')
  @Post()
  async createSession(
    @Body() dto: CreateSessionDto,
    @Request() req,
  ): Promise<Session> {
    return await this.sessionService.createSession(dto, req.user.userId);
  }


  @Roles('admin', 'teacher', 'invigilator')
  @Get()
  async getSessions(@Query('status') status?: string): Promise<Session[]> {
    return await this.sessionService.getAllSessions(status);
  }


  @Roles('admin', 'teacher', 'invigilator')
  @Get(':sessionId')
  async getSessionById(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<Session> {
    return await this.sessionService.getSessionById(sessionId);
  }


  @Roles('admin', 'teacher', 'invigilator')
  @Get(':sessionId/students')
  async getEnrolledStudents(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<SessionStudent[]> {
    return await this.sessionService.getStudentsInSession(sessionId);
  }


  @Roles('admin', 'teacher')
  @Post(':sessionId/enrollments')
  async enrollStudents(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: EnrollStudentsDto,
  ): Promise<SessionStudent[]> {
    return await this.sessionService.enrollStudents(sessionId, dto);
  }


  @Roles('admin', 'teacher')
  @Patch(':sessionId')
  async updateSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpdateSessionDto,
    @Request() req,
  ): Promise<Session> {
    return await this.sessionService.updateSession(sessionId, dto, req.user.userId);
  }


  @Roles('admin', 'teacher')
  @Delete(':sessionId')
  async deleteSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.sessionService.deleteSession(sessionId, req.user.userId);
  }
}
