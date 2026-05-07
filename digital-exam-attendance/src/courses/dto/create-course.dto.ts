import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({description: 'Unique code for the course', example: 'COM211'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code!: string;

  @ApiProperty({description: 'Name of the course', example: 'Computer Science Fundamentals'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({description: 'Indicates if the course is active', example: true})
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
