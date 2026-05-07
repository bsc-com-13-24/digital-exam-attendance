import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddStudentDto } from './add-student.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentsDto {
  @ApiProperty({
    type: [AddStudentDto],
    example: [{ student_id: 'student-id-123' }, { student_id: 'student-id-456' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddStudentDto)
  students!: AddStudentDto[];
}
