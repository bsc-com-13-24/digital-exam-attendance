import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'End of Semester Exams' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ type: [String], example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  course_ids!: string[];

  @ApiProperty({ example: 'Lecture Theatre 1' })
  @IsString()
  @IsNotEmpty()
  venue!: string;

  @ApiProperty({ example: '2026-05-10T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_start!: string;

  @ApiProperty({ example: '2026-05-10T12:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_end!: string;

  @ApiProperty({ required: false, example: 'uuid-room' })
  @IsUUID()
  @IsOptional()
  room_id?: string;
}
