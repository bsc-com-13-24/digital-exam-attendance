import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddStudentDto {
  @IsUUID()
  @IsNotEmpty()
  student_id!: string;

  @IsString()
  @IsNotEmpty()
  student_number!: string;

  @IsString()
  @IsNotEmpty()
  full_name!: string;
}
