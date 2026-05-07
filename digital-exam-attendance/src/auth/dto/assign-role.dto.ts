import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
    @ApiProperty({ example: '2cc5175c-e8e0-4f63-9b71-41230a7dd7db', description: 'User ID' })
    @IsString()
    @IsNotEmpty()
    user_id!: string;

    @ApiProperty({ example: 'a5b8511d-779a-48d5-b9c6-6d568d3e3f89', description: 'Role ID' })
    @IsString()
    @IsNotEmpty()
    role_id!: string;
}