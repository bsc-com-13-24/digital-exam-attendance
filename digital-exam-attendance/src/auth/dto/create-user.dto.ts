import { IsString, IsOptional, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    first_name!: string;

    @IsString()
    @IsNotEmpty()
    last_name!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Password must be at least 4 characters long' })
    password!: string;

    @IsString()
    @IsOptional()
    role!: string;

    @IsString()
    @IsOptional()
    staff_id?: string;
}