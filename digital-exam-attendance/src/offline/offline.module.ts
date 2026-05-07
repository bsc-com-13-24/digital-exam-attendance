import { Module } from '@nestjs/common';
import { OfflineService } from './offline.service';
import { OfflineController } from './offline.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OfflineService],
  controllers: [OfflineController],
  exports: [OfflineService],
})
export class OfflineModule {}
