import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { AttendanceRecord } from './entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('attendance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles('admin', 'teacher', 'invigilator')
  @Post('mark')
  async markAttendance(@Body() dto: CreateAttendanceDto, @Request() req): Promise<AttendanceRecord> {
    return this.attendanceService.markAttendance(dto, req.user.userId);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Post('bulk-mark')
  async bulkMarkAttendance(@Body() dto: BulkMarkAttendanceDto, @Request() req): Promise<AttendanceRecord[]> {
    return this.attendanceService.bulkMarkAttendance(dto, req.user.userId);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Put(':id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
    @Request() req,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.updateAttendance(id, dto, req.user.userId);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get()
  async getAttendanceRecords(@Query() query: AttendanceQueryDto): Promise<AttendanceRecord[]> {
    return this.attendanceService.getAttendanceRecords(query);
  }

  @Roles('admin', 'teacher', 'invigilator')
  @Get('manual-search/:sessionId')
  async searchStudentsForManualMark(
    @Param('sessionId') sessionId: string,
    @Query('search') search: string,
  ): Promise<SessionStudent[]> {
    return this.attendanceService.searchStudentsForManualMark(sessionId, search);
  }
}
