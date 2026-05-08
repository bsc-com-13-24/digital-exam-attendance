import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStudentDto {
  @ApiProperty({ example: '2023001', description: 'Unique student identification number' })
  @IsString()
  @IsNotEmpty()
  student_number!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the student' })
  @IsString()
  @IsNotEmpty()
  full_name!: string;
}
