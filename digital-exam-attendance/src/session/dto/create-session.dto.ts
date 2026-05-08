import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Mid-term Exam Session 1', description: 'Title of the exam session' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ type: [String], example: ['COM211', 'COM212'], description: 'List of unique course codes' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  course_codes!: string[];

  @ApiProperty({ description: 'The room code where the session will be held', example: 'A101' })
  @IsString()
  @IsNotEmpty()
  room_code!: string;

  @ApiProperty({ description: 'The room name or general venue description (e.g. Lecture Theatre 1)', example: 'Lecture Theatre 1' })
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
}
