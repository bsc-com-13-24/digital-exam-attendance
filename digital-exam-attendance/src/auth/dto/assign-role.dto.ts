import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty({ message: 'User ID is required' })
    userId!: string;

    @IsString()
    @IsNotEmpty({ message: 'Role name is required' })
    roleName!: string;
}
