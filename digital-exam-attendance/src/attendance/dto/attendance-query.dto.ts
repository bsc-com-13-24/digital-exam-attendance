import { IsString, IsOptional, IsUUID } from 'class-validator';

export class AttendanceQueryDto {
  @IsOptional()
  @IsUUID()
  session_id?: string;

  @IsOptional()
  @IsString()
  student_number?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsUUID()
  course_id?: string;
}
