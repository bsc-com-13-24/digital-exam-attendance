import { Controller, Post, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { AttendanceRecord } from './entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  async markAttendance(@Body() dto: CreateAttendanceDto): Promise<AttendanceRecord> {
    return this.attendanceService.markAttendance(dto);
  }

  @Post('bulk-mark')
  async bulkMarkAttendance(@Body() dto: BulkMarkAttendanceDto): Promise<AttendanceRecord[]> {
    return this.attendanceService.bulkMarkAttendance(dto);
  }

  @Put(':id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.updateAttendance(id, dto);
  }

  @Get()
  async getAttendanceRecords(@Query() query: AttendanceQueryDto): Promise<AttendanceRecord[]> {
    return this.attendanceService.getAttendanceRecords(query);
  }

  @Get('report/:sessionId')
  async getAttendanceReport(@Param('sessionId') sessionId: string): Promise<{
    totalEnrolled: number;
    present: number;
    absent: number;
    late: number;
  }> {
    return this.attendanceService.getAttendanceReport(sessionId);
  }

  @Get('manual-search/:sessionId')
  async searchStudentsForManualMark(
    @Param('sessionId') sessionId: string,
    @Query('search') search: string,
  ): Promise<SessionStudent[]> {
    return this.attendanceService.searchStudentsForManualMark(sessionId, search);
  }
}
