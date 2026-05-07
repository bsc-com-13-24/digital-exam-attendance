import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'an email address used when creating account is needed to process a login action', example: 'example@email.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string;

    @ApiProperty({ description: 'the password must be the same as the one used when creating the account', example: 'er23#@' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}
