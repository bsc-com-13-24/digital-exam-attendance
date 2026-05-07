import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceDto } from './create-attendance.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-records.entity';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
    @ApiProperty({ example: 'PRESENT', enum: AttendanceStatus, description: 'Updated attendance status' })
    @IsEnum(AttendanceStatus)
    @IsOptional()
    status?: AttendanceStatus;

    @ApiProperty({ example: 'Manual', description: 'Updated method of attendance (e.g., Manual, Auto, Scanned)' })
    @IsString()
    @IsOptional()
    method?: string;

    @ApiProperty({ example: 'Late entry', description: 'Updated remarks for the attendance record' })
    @IsString()
    @IsOptional()
    remarks?: string;

    @ApiProperty({ example: '507f1f77-c864-4600-a9c6-f39868bc1234', description: 'ID of the user who is updating the record' })
    @IsUUID()
    @IsOptional()
    marked_by?: string;
}