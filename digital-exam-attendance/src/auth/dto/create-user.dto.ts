<<<<<<< HEAD
// dto/create-user.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()                 
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;          

  @IsString()
  @IsOptional()
  role!: string;
=======
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    first_name!: string;

    @IsString()
    @IsNotEmpty()
    last_name!: string;
    
    @IsString()
    @IsNotEmpty()
    email! : string;

    @IsString()
    @IsNotEmpty()
    password! : string;

    @IsString()
    @IsOptional()
    role! : string;
>>>>>>> 1f4981e (Configured dtos and service for Offline module.)
}