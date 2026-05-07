import { IsString, IsOptional, IsNotEmpty, IsEmail, MinLength, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail({}, { message: 'Email must be a valid address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'er23#@' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({ example: 'teacher' })
  @IsString()
  @IsNotEmpty()
  role!: string;
}