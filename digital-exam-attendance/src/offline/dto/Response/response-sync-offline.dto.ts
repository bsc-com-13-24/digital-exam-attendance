export class OfflineSyncErrorDto{
    local_id!:string;
    reason!:string;
}

export class OfflineSyncResultDto{
    accepted!: string[];
    rejected!: string[];
    errors!: OfflineSyncErrorDto[];
}

export class OfflineSyncResponseDto{
    success!: boolean;
    message!: string;
    result!: OfflineSyncResultDto;
}