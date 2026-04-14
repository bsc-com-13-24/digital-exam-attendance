import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { Session } from './entities/sessions.entity';
import { Course } from './entities/courses.entity';
import { SessionStudent } from './entities/session-students.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Course, SessionStudent])],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
