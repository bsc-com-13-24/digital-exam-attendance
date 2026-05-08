import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  course_ids!: string[];

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

  @IsUUID()
  @IsOptional()
  room_id?: string;
}
