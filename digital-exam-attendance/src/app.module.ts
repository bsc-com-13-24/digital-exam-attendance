import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { OfflineModule } from './offline/offline.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/users.entity';
import { Role } from './auth/entities/roles.entity';
import { UserRole } from './auth/entities/user-roles.entity';
import { Course } from './session/entities/courses.entity';
import { Session } from './session/entities/sessions.entity';
import { SessionStudent } from './session/entities/session-students.entity';
import { AttendanceRecord } from './attendance/entities/attendance-records.entity';
import { AuditLog } from './attendance/entities/audit-logs.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        serviceName: config.get('DB_SERVICE_NAME'),
        synchronize: config.get('DB_SYNCHRONIZE') === 'true',
        entities: [
          User,
          Role,
          UserRole,
          Course,
          Session,
          SessionStudent,
          AttendanceRecord,
          AuditLog,
        ],
        logging: true,
      }),
    }),
    AuthModule,
    SessionModule,
    AttendanceModule,
    OfflineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
