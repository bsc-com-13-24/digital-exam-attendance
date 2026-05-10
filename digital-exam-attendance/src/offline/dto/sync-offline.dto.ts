import {
  IsArray,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsUUID,
  IsEnum,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../attendance/entities/attendance-records.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ScanMethod {
  SCAN = 'scan',
  MANUAL = 'manual',
}

export interface SyncResult {
  successCount: number;
  failureCount: number;
  failures: Array<{
    localId: string;
    reason: string;
  }>;
} 

export class OfflineAttendanceRecordDto {
  @ApiProperty({description: 'Local ID for offline tracking', example: 'offline-001'})
  @IsString()
  @IsNotEmpty()
  localId!: string;

  @ApiProperty({description: 'Session ID', example: 'session-001'})
  @IsUUID()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty({description: 'Student registration number', example: 'BSC-COM-02-24'})
  @IsString()
  @IsNotEmpty()
  studentNumber!: string;

  @ApiProperty({ enum: AttendanceStatus , description: 'Attendance status', example: 'present, absent or late'})
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status!: AttendanceStatus;

  @ApiProperty({ enum: ScanMethod , description: 'Scan or Manual'})
  @IsEnum(ScanMethod)
  @IsNotEmpty()
  method!: ScanMethod;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  markedAt!: string;

  @ApiProperty({ required: false, description: 'Optional remarks if exam was incomplete', example: 'Student left early due to illness'})
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class SyncOfflineDto {
  @ApiProperty({description: 'Device ID', example: 'scanner-001'})
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty({ type: [OfflineAttendanceRecordDto] , description: 'Records synced from offline storage'})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfflineAttendanceRecordDto)
  offlineRecords!: OfflineAttendanceRecordDto[];
}