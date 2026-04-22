import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OfflineService } from './offline.service';
import { SyncOfflineDto } from './dto/sync-offline.dto';

@Controller('offline')
export class OfflineController {
  constructor(private readonly offlineService: OfflineService) {}

  @Post('sync')
  async syncOfflineRecords(@Body() syncDto: SyncOfflineDto) {
    try {
      return await this.offlineService.syncOfflineRecords(syncDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to sync offline records');
    }
  }
}
