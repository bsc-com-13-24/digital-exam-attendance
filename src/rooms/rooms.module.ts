import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/rooms.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionStudent } from '../session/entities/session-students.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, SessionStudent, AttendanceRecord]),
    AuthModule,
  ],
  providers: [RoomsService, RolesGuard],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
