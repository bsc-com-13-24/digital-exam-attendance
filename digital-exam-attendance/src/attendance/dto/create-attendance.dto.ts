import { IsString, IsOptional, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance-records.entity';

export class CreateAttendanceDto {
    @IsUUID()
    @IsNotEmpty()
    session_id!: string;

    @IsUUID()
    @IsNotEmpty()
    session_student_id!: string;

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status!: AttendanceStatus;

    @IsString()
    @IsNotEmpty()
    method!: string;

    @IsString()
    @IsOptional()
    remarks?: string;

    @IsUUID()
    @IsOptional()
    marked_by?: string;
}