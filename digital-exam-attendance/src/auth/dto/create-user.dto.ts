import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Allan', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Smith', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'allan@gmail.com', description: 'User email address (must be unique)' })
  @IsEmail({}, { message: 'Email must be a valid address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Allan1234', description: 'User password (min 6 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({ example: 'admin', description: 'User role (e.g., admin, teacher, invigilator)' })
  @IsString()
  @IsNotEmpty()
  role!: string;
}