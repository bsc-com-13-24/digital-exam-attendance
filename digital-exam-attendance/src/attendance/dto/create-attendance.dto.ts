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
}