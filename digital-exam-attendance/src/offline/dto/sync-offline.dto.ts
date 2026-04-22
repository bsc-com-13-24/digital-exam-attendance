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

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  INCOMPLETE = 'incomplete',
}

export enum ScanMethod {
  SCAN = 'scan',
  MANUAL = 'manual',
}

export class OfflineAttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  localId!: string; // Client-generated UUID for offline tracking

  @IsUUID()
  @IsNotEmpty()
  sessionId!: string; // Which exam session this record belongs to

  @IsUUID()
  @IsNotEmpty()
  studentId!: string; // Which student attended

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status!: AttendanceStatus; // present, absent, or incomplete

  @IsEnum(ScanMethod)
  @IsNotEmpty()
  method!: ScanMethod; // scan or manual

  @IsISO8601()
  @IsNotEmpty()
  markedAt!: string; // ISO 8601 timestamp when marked

  @IsString()
  @IsOptional()
  remarks?: string; // Optional remarks if exam was incomplete
}

export class SyncOfflineDto {
  @IsString()
  @IsNotEmpty()
  deviceId!: string; // Unique identifier for the offline device/scanner

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfflineAttendanceRecordDto)
  offlineRecords!: OfflineAttendanceRecordDto[]; // Records synced from offline storage
}