import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAttendanceDto } from './create-attendance.dto';

export class BulkMarkAttendanceDto {
  @ApiProperty({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'Session UUID' })
  @IsString()
  @IsNotEmpty()
  session_id!: string;

  @ApiProperty({ type: [CreateAttendanceDto], description: 'List of attendance records' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records!: CreateAttendanceDto[];
}
