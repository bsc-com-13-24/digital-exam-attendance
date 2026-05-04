import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../session/entities/sessions.entity';
import { AttendanceRecord } from 'src/attendance/entities/attendance-records.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(AttendanceRecord)
        private readonly attendanceRepository: Repository<AttendanceRecord>
    ) { }

    async getActiveSessions(): Promise<number> {
        return await this.sessionRepository.count({
            where: { status: "active" }
        });
    }

    async getUpcomingSessions(): Promise<number> {
        return await this.sessionRepository.count({
            where: { status: "upcoming" }
        });
    }

    async getExpiredSessions(): Promise<number> {
        return await this.sessionRepository.count({
            where: { status: "expired" }
        });
    }

    
}
