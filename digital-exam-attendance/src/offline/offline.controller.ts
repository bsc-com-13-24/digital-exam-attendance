import { Controller, Post, Body, BadRequestException, InternalServerErrorException, UseGuards, Request } from '@nestjs/common';
import { OfflineService, SyncResult } from './offline.service';
import { SyncOfflineDto } from './dto/sync-offline.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('offline')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OfflineController {
  constructor(private readonly offlineService: OfflineService) {}

  @Roles('admin', 'teacher')
  @Post('sync')
  async syncOfflineRecords(@Body() syncDto: SyncOfflineDto, @Request() req): Promise<SyncResult> {
    try {
      return await this.offlineService.syncOfflineRecords(syncDto, req.user.userId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to sync offline records');
    }
  }
}
