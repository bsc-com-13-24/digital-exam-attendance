import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, MaxLength, Min, IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @ApiProperty({ example: 'B501' })
    @IsString()
    @IsNotEmpty()
    room_code!: string;

    @ApiProperty({ example: 'Science Lab' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'Main Building', nullable: true })
    @IsString()
    @IsOptional()
    building?: string;

    @ApiProperty({ example: 40 })
    @IsInt()
    @Min(1)
    @MaxLength(1000)
    capacity!: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    is_active!: boolean;

    @ApiProperty({ example: '507f1f77-c864-4600-a9c6-f39868bc1234' })
    @IsString()
    @IsOptional()
    created_by?: string;
}
