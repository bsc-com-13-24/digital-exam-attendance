import { ApiProperty } from "@nestjs/swagger";

export class OfflineSyncErrorDto {
  @ApiProperty({description: 'Reason for sync failure'})
  localId!: string;
  reason!: string;
}

export class SyncResultDto {
  @ApiProperty({description: 'Successful sync'})
  successCount!: number;

  @ApiProperty({description: 'number of failed sync trials'})
  failureCount!: number;

  @ApiProperty({ type: [OfflineSyncErrorDto] })
  failures!: OfflineSyncErrorDto[];
}

export class OfflineSyncResponseDto {
  @ApiProperty({description: 'Successful sync or sync failure message'})
  success!: boolean;
  message!: string;
  data!: SyncResultDto;
}