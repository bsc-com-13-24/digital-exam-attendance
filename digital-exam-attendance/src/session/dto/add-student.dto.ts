import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStudentDto {
  @ApiProperty({ example: 'student-number-123' })
  @IsString()
  @IsNotEmpty()
  student_number!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name!: string;
}
