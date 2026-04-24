import { IsString, IsNotEmpty } from 'class-validator';

export class AddStudentDto {
  @IsString()
  @IsNotEmpty()
  student_number!: string;

  @IsString()
  @IsNotEmpty()
  full_name!: string;
}
