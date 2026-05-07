import { IsString, IsOptional, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-records.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
    @ApiProperty({ example: 'session-id-123' })
    @IsUUID()
    @IsNotEmpty()
    session_id!: string;

    @ApiProperty({ example: 'student-number-123' })
    @IsString()
    @IsNotEmpty()
    student_number!: string;

    @ApiProperty({ example: 'PRESENT' })
    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status!: AttendanceStatus;

    @ApiProperty({ example: 'scanned', description: 'Method of attendance: scanned, Manual, Auto' })
    @IsString()
    @IsNotEmpty()
    method!: string;

    @ApiProperty({ example: 'remarks-123', description: 'Remarks for the attendance' })
    @IsString()
    @IsOptional()
    remarks?: string;

    @ApiProperty({ example: 'user-id-123', description: 'The user who marked the attendance' })
    @IsUUID()
    @IsOptional()
    marked_by?: string;
}