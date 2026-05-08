import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddStudentDto } from './add-student.dto';

export class EnrollStudentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddStudentDto)
  students!: AddStudentDto[];
}
