<<<<<<< HEAD
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
    @IsUUID()
    @IsNotEmpty()
    student_id!: string;

    @IsUUID()
    @IsNotEmpty()
    session_id!: string;

    @IsUUID()
    @IsNotEmpty()
    session_student_id!: string;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsString()
    @IsNotEmpty()
    method!: string;

    @IsString()
    @IsOptional()
    remarks?: string;

    @IsUUID()
    @IsOptional()
    marked_by?: string;
=======
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
    @IsString()
    @IsNotEmpty()
    student_id!: string;

    @IsString()
    @IsNotEmpty()
    session_id!: string;

    @IsString()
    @IsNotEmpty()
    session_student_id!: string;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsString()
    @IsNotEmpty()
    method!: string;

    @IsString()
    @IsOptional()
    remarks?: string;
>>>>>>> 1f4981e (Configured dtos and service for Offline module.)
}