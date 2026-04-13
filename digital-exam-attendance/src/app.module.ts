import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { OfflineModule } from './offline/offline.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),SessionModule, OfflineModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
