import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineService } from './offline.service';
import { OfflineController } from './offline.controller';
import { AuthModule } from '../auth/auth.module';
import { Session } from '../session/entities/sessions.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, AttendanceRecord]),
    AuthModule
  ],
  providers: [OfflineService],
  controllers: [OfflineController],
  exports: [OfflineService],
})
export class OfflineModule {}
