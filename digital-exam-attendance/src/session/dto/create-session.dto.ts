import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Session 1' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'course-id-123' })
  @IsUUID()
  @IsNotEmpty()
  course_id!: string;

  @ApiProperty({ description: 'The room where the session will be held' })
  @IsString()
  @IsNotEmpty()
  venue!: string;

  @ApiProperty({ description: 'The scheduled start time of the session', example: 'scheduled-start-123' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_start!: string;

  @ApiProperty({ description: 'The scheduled end time of the session', example: 'scheduled-end-123' })
  @IsNotEmpty()
  scheduled_end!: string;

  @ApiProperty({ description: 'The user who created the session', example: 'user-id-123' })
  @IsUUID()
  @IsOptional()
  created_by?: string;

  @ApiProperty({ description: 'The room where the session is held', example: 'room-id-123' })
  @IsOptional()
  room_id?: string;
}
