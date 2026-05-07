import { IsString, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-records.entity';

export class AttendanceQueryDto {
  @IsOptional()
  @IsUUID()
  session_id?: string;

  @IsOptional()
  @IsString()
  student_number?: string;

  @IsOptional()
  @IsString()
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsUUID()
  course_id?: string;
}
