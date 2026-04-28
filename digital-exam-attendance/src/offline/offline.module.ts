import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineService } from './offline.service';
import { OfflineController } from './offline.controller';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord, SessionStudent, Session]),
    AuthModule,
  ],
  providers: [OfflineService, RolesGuard],
  controllers: [OfflineController],
  exports: [OfflineService],
})
export class OfflineModule {}
