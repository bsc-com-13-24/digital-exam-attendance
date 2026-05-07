import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({ example: 'old_password', description: 'Old Password' })
    @IsString()
    @IsNotEmpty()
    old_password!: string;

    @ApiProperty({ example: 'new_password', description: 'New Password' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'New password must be at least 4 characters long' })
    new_password!: string;

    @ApiProperty({ example: 'confirm_password', description: 'Confirm Password' })
    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Confirm password must be at least 4 characters long' })
    confirm_password!: string;
}