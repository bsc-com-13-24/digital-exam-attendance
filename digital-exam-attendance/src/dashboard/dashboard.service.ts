import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../session/entities/sessions.entity';
import { AttendanceRecord, AttendanceStatus } from 'src/attendance/entities/attendance-records.entity';
import { SessionStudent } from 'src/session/entities/session-students.entity';
import { In } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        @InjectRepository(AttendanceRecord)
        private readonly attendanceRepository: Repository<AttendanceRecord>,
        @InjectRepository(SessionStudent)
        private readonly sessionStudentRepository: Repository<SessionStudent>
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

    async countRegisteredStudents(sessionId: string): Promise<number> {
        return await this.sessionStudentRepository.count({
            where: { session_id: sessionId }
        });
    }

    async countActualAttendees(sessionId: string): Promise<number> {
        return await this.attendanceRepository.count({
            where: {
                session_id: sessionId,
                status: In([AttendanceStatus.PRESENT, AttendanceStatus.LATE])
            }
        });
    }

    async getSessionAttendanceStats(sessionId: string) {
        return await this.attendanceRepository
            .createQueryBuilder('record')
            .select('record.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('record.session_id = :sessionId', { sessionId })
            .groupBy('record.status')
            .getRawMany();
    }

}
