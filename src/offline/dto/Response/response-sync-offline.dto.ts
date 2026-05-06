export class OfflineSyncErrorDto {
  localId!: string;
  reason!: string;
}

export class SyncResultDto {
  successCount!: number;
  failureCount!: number;
  failures!: OfflineSyncErrorDto[];
}

export class OfflineSyncResponseDto {
  success!: boolean;
  message!: string;
  data!: SyncResultDto;
}