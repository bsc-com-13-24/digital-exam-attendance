import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
