import { Controller, Post, Body, Param, Get, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AuthGuard } from '@nestjs/passport';
import { Session } from './entities/sessions.entity';
import { Course } from './entities/courses.entity';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionStudent } from './entities/session-students.entity';

@Controller('session')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  // COURSE ENDPOINTS
  @Roles('admin', 'teacher')
  @Post('course')
  async createCourse(@Body() dto: CreateCourseDto, @Request() req): Promise<Course> {
    return await this.sessionService.createCourse(dto, req.user.userId);
  }

  @Get('course')
  async getAllCourses(): Promise<Course[]> {
    return await this.sessionService.getAllCourse();
  }

  @Get('course/:id')
  async getCourse(@Param('id') id: string): Promise<Course> {
    return await this.sessionService.getCourseById(id);
  }

  @Roles('admin', 'teacher')
  @Patch('course/:id')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Request() req) {
    return this.sessionService.updateCourse(id, dto, req.user.userId);
  }

  @Roles('admin', 'teacher')
  @Delete('course/:id')
  removeCourse(@Param('id') id: string, @Request() req) {
    return this.sessionService.removeCourse(id, req.user.userId);
  }

  // SESSION ENDPOINTS
  @Roles('admin', 'teacher')
  @Post()
  async create(@Body() dto: CreateSessionDto, @Request() req): Promise<Session> {
    return await this.sessionService.createSession(dto, req.user.userId);
  }

  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionService.getAllSessions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Session> {
    return await this.sessionService.getSessionById(id);
  }

  @Get(':id/students')
  async getSessionStudents(@Param('id') id: string): Promise<SessionStudent[]> {
    return await this.sessionService.getStudentsBySessionId(id);
  }

  @Roles('admin', 'teacher')
  @Post(':id/enroll')
  async enrollStudents(@Param('id') id: string, @Body() dto: EnrollStudentsDto): Promise<SessionStudent[]> {
    return await this.sessionService.enrollStudents(id, dto);
  }

  @Roles('admin', 'teacher')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateSessionDto, @Request() req) {
    return this.sessionService.updateSession(id, updateUserDto, req.user.userId);
  }

  @Roles('admin', 'teacher')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.sessionService.removeSession(id, req.user.userId);
  }
}
