// Request DTO for syncing offline records

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
  @IsString()
  localId!: string;

  @IsUUID()
  sessionId!: string;

  @IsUUID()
  studentId!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsEnum(ScanMethod)
  method!: ScanMethod;

  @IsISO8601()
  markedAt!: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

    @UpdateDateColumn({name: 'update_at'})
    updated_at!: Date;
}

export class equestSyncOfflineDto{
    device_id!:string;
    OfflineRecords!: OfflineRecordDto[];
}