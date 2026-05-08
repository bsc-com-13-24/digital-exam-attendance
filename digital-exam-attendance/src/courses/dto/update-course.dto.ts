import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    @ApiProperty({ example: 'COM212', description: 'Updated unique code for the course' })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    code?: string;

    @ApiProperty({ example: 'Advanced Computer Science', description: 'Updated name of the course' })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ example: true, description: 'Updated active status of the course' })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
