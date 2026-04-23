import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  @IsNotEmpty()
  course_id!: string;

  @IsString()
  @IsNotEmpty()
  venue!: string;

  @IsDateString()
  @IsNotEmpty()
  scheduled_start!: string;

  @IsDateString()
  @IsNotEmpty()
  scheduled_end!: string;

  @IsUUID()
  @IsOptional()
  created_by?: string;
}
