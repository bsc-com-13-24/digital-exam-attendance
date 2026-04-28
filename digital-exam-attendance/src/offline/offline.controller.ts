import { Controller, Post, Body, BadRequestException, InternalServerErrorException, Logger, UsePipes, ValidationPipe, ConflictException, NotFoundException } from '@nestjs/common';
import { OfflineService } from './offline.service';
import { SyncOfflineDto } from './dto/sync-offline.dto';

@Controller('offline')
export class OfflineController {
  private readonly logger = new Logger(OfflineController.name);

  constructor(private readonly offlineService: OfflineService) {}

  @Post('sync')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async syncOfflineRecords(@Body() syncDto: SyncOfflineDto) {
    try {
      this.logger.log(`Received sync request from device: ${syncDto.deviceId}`);
      const result = await this.offlineService.syncOfflineRecords(syncDto);
      this.logger.log(`Sync completed for device ${syncDto.deviceId}: ${result.successCount} success, ${result.failureCount} failures`);
      return {
        success: true,
        message: 'Offline records synced successfully',
        data: result,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Sync failed: ${errorMessage}`, error instanceof Error ? error.stack : '');

      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to sync offline records');
    }
  }
}
