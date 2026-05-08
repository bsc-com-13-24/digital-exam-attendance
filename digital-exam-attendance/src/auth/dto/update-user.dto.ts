import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ example: 'John', description: 'Updated first name of the user' })
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiProperty({ example: 'Doe', description: 'Updated last name of the user' })
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiProperty({ example: 'user@example.com', description: 'Updated email address' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'newpassword123', description: 'Updated password (min 6 characters)' })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @ApiProperty({ example: 'teacher', description: 'Updated role of the user' })
    @IsString()
    @IsOptional()
    role?: string;
}
