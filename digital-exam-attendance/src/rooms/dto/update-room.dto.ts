import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, MaxLength, Min, IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @ApiProperty({ example: 'B501', description: 'Updated unique code for the room' })
    @IsString()
    @IsNotEmpty()
    room_code!: string;

    @ApiProperty({ example: 'Science Lab', description: 'Updated name of the room' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'Main Building', nullable: true, description: 'Updated building location' })
    @IsString()
    @IsOptional()
    building?: string;

    @ApiProperty({ example: 40, description: 'Updated student capacity' })
    @IsInt()
    @Min(1)
    @MaxLength(1000)
    capacity!: number;

    @ApiProperty({ example: true, description: 'Updated status of the room' })
    @IsBoolean()
    is_active!: boolean;

    @ApiProperty({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'ID of the user performing the update' })
    @IsString()
    @IsOptional()
    created_by?: string;
}
