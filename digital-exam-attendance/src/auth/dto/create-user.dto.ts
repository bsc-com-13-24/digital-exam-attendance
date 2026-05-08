import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: [String], example: 'Allan' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty({ type: [String], example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({ type: [IsEmail], example: 'allan@gmail.com' })
  @IsEmail({}, { message: 'Email must be a valid address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: [String], example: 'Allan1234' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({ type: [String], example: 'admin' })
  @IsString()
  @IsNotEmpty()
  role!: string;
}