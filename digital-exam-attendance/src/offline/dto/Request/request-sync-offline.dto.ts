
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsEnum, IsOptional, IsISO8601 } from "class-validator";

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

export enum ScanMethod {
  SCAN = 'scan',
  MANUAL = 'manual',
}

export class OfflineRecordRequestDto {
  @ApiProperty({description: 'Local ID for offline tracking', example: 'offline-001'})
  @IsString()
  localId!: string;

  @ApiProperty({description: 'Session ID', example: 'session-001'})
  @IsUUID()
  sessionId!: string;

  @ApiProperty({description: 'Student Registration Number', example: 'BSC-COM-02-24'})
  @IsUUID()
  studentId!: string;

  @ApiProperty({ enum: AttendanceStatus , description: 'Attendance status', example: 'present, absent or late'})
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @ApiProperty({ enum: ScanMethod , description: 'Scan or Manual', example: 'scan or manual'})
  @IsEnum(ScanMethod)
  method!: ScanMethod;

  @ApiProperty({description: 'Timestamp when marked', example: '2023-10-01T10:00:00Z'})
  @IsISO8601()
  markedAt!: string;

  @ApiProperty({ required: false, description: 'Optional remarks if exam was incomplete', example: 'Student left early due to illness'})
  @IsString()
  @IsOptional()
  remarks?: string;
}
