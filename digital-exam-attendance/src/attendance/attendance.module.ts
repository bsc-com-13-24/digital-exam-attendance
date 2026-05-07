import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRecord } from './entities/attendance-records.entity';
import { AuditLog } from './entities/audit-logs.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord, AuditLog, SessionStudent, Session]),
    AuthModule,
  ],
  providers: [AttendanceService, RolesGuard],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
