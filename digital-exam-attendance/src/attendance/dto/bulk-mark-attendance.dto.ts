import { IsString, IsArray, ValidateNested, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/attendance-records.entity';

export class BulkAttendanceItemDto {
  @ApiProperty({ example: '2023001', description: 'Student Number' })
  @IsString()
  @IsNotEmpty()
  student_number!: string;

  @ApiProperty({ example: 'PRESENT', enum: AttendanceStatus, description: 'Attendance Status' })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status!: AttendanceStatus;

  @ApiProperty({ example: 'Manual', description: 'Method of attendance marking' })
  @IsString()
  @IsNotEmpty()
  method!: string;

  @ApiProperty({ example: 'Student arrived on time', description: 'Optional remarks', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class BulkMarkAttendanceDto {
  @ApiProperty({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'Session UUID' })
  @IsUUID()
  @IsNotEmpty()
  session_id!: string;

  @ApiProperty({ type: [BulkAttendanceItemDto], description: 'List of attendance records' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceItemDto)
  records!: BulkAttendanceItemDto[];
}
