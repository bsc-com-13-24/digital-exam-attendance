import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { OfflineModule } from './offline/offline.module';

@Module({
  imports: [SessionModule, OfflineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
