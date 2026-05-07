import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceDto } from './create-attendance.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BulkMarkAttendanceDto {
  @ApiProperty({ type: String, example: 'session-id-123' })
  @IsString()
  @IsNotEmpty()
  session_id!: string;

  @ApiProperty({
    type: [CreateAttendanceDto],
    example: [{ student_id: 'e3f7e5f7-e5f7-e5f7-e5f7-e5f7e5f7e5f7', status: 'PRESENT' }, { student_id: 'student-id-456', status: 'ABSENT' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records!: CreateAttendanceDto[];
}
