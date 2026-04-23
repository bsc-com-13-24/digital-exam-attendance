import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineService } from './offline.service';
import { OfflineController } from './offline.controller';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, SessionStudent, Session])],
  providers: [OfflineService],
  controllers: [OfflineController],
  exports: [OfflineService],
})
export class OfflineModule {}
