import { PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
    @ApiProperty({ example: 'Updated Session Title', description: 'Updated title of the session' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'COM212', description: 'Updated course code for the session' })
    @IsString()
    @IsOptional()
    course_code?: string;

    @ApiProperty({ example: 'Room 102', description: 'Updated venue/room name or code' })
    @IsString()
    @IsOptional()
    venue?: string;

    @ApiProperty({ example: '2023-12-01T10:00:00Z', description: 'Updated scheduled start time' })
    @IsDateString()
    @IsOptional()
    scheduled_start?: string;

    @ApiProperty({ example: '2023-12-01T13:00:00Z', description: 'Updated scheduled end time' })
    @IsDateString()
    @IsOptional()
    scheduled_end?: string;
}
