import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/courses.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [
      TypeOrmModule.forFeature([Course]),
      AuthModule,
    ],
  controllers: [CoursesController],
  providers: [CoursesService, RolesGuard],
})
export class CoursesModule {}
