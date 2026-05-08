import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Mid-term Exam Session 1', description: 'Title of the exam session' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'COM211', description: 'The unique course code (e.g. COM211)' })
  @IsString()
  @IsNotEmpty()
  course_code!: string;

  @ApiProperty({ description: 'The room code or name where the session will be held', example: 'A101' })
  @IsString()
  @IsNotEmpty()
  venue!: string;

  @ApiProperty({ description: 'The scheduled start time of the session', example: '2023-10-25T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_start!: string;

  @ApiProperty({ description: 'The scheduled end time of the session', example: '2023-10-25T12:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_end!: string;

  @ApiProperty({ description: 'Number of students expected for this session', example: 50, required: false })
  @IsOptional()
  expected_students?: number;
}
