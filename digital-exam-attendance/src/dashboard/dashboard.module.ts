import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
//import { DashboardController } from './dashboard.controller';
import { AuthModule } from '../auth/auth.module';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { Session } from '../session/entities/sessions.entity';
import { SessionStudent } from '../session/entities/session-students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord, Session, SessionStudent]),
    AuthModule,
  ],
  providers: [DashboardService],
 // controllers: [DashboardController],
})
export class DashboardModule {}
