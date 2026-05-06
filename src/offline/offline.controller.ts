import { Controller, Post, Body, BadRequestException, InternalServerErrorException, Logger, UsePipes, ValidationPipe, ConflictException, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { OfflineService } from './offline.service';
import { SyncOfflineDto } from './dto/sync-offline.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('offline')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OfflineController {
  private readonly logger = new Logger(OfflineController.name);

  constructor(private readonly offlineService: OfflineService) {}

  @Roles('admin', 'teacher', 'invigilator')
  @Post('sync')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async syncOfflineRecords(@Body() syncDto: SyncOfflineDto, @Request() req) {
    try {
      this.logger.log(`Received sync request from device: ${syncDto.deviceId} by user: ${req.user.userId}`);
      const result = await this.offlineService.syncOfflineRecords(syncDto, req.user.userId);
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
