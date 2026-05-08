import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AddStudentDto } from './add-student.dto';

export class EnrollStudentsDto {
  @ApiProperty({ type: [AddStudentDto], description: 'List of students to enroll' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddStudentDto)
  students!: AddStudentDto[];
}
