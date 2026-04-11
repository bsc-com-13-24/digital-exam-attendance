import { Module } from '@nestjs/common';
import { OfflineService } from './offline.service';
import { OfflineController } from './offline.controller';

@Module({
  providers: [OfflineService],
  controllers: [OfflineController]
})
export class OfflineModule {}
