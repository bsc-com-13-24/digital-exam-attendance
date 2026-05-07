import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/rooms.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    AuthModule,
  ],
  providers: [RoomsService, RolesGuard],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
