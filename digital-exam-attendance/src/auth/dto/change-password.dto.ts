import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    old_password!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'New password must be at least 4 characters long' })
    new_password!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, { message: 'Confirm password must be at least 4 characters long' })
    confirm_password!: string;
}