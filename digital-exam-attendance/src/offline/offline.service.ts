import { Injectable, BadRequestException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, In } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { SyncOfflineDto, OfflineAttendanceRecordDto, SyncResult } from './dto/sync-offline.dto';

@Injectable()
export class OfflineService {
  private readonly logger = new Logger(OfflineService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) { }

  async syncOfflineRecords(syncDto: SyncOfflineDto, userId: string): Promise<SyncResult> {
    if (!syncDto.offlineRecords?.length) {
      throw new BadRequestException('No offline records provided');
    }

    this.logger.log(`Starting sync for device ${syncDto.deviceId} with ${syncDto.offlineRecords.length} records`);

    const result: SyncResult = {
      successCount: 0,
      failureCount: 0,
      failures: [],
    };

    // BATCH OPTIMIZATION: Pre-fetch all sessions in one DB call
    const sessionIds = [...new Set(syncDto.offlineRecords.map(r => r.sessionId))];
    const sessions = await this.sessionRepo.find({ where: { id: In(sessionIds) } });
    const sessionMap = new Map(sessions.map(s => [s.id, s]));

    for (const record of syncDto.offlineRecords) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await this.validateAndSyncRecord(record, userId, queryRunner, sessionMap);
        await queryRunner.commitTransaction();
        result.successCount++;
      } catch (error: any) {
        await queryRunner.rollbackTransaction();
        result.failureCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.failures.push({
          localId: record.localId,
          code: error.syncErrorCode ?? 'UNKNOWN_ERROR',
          reason: errorMessage,
        });
        this.logger.warn(`Failed to sync record ${record.localId}: ${errorMessage}`);
      } finally {
        await queryRunner.release();
      }
    }

    this.logger.log(`Sync completed - Success: ${result.successCount}, Failures: ${result.failureCount}`);

    // PULL PHASE: Return records created/updated by other devices
    if (syncDto.lastSyncTimestamp) {
      const serverUpdates = await this.getServerUpdates(
        syncDto.lastSyncTimestamp,
        sessionIds
      );
      result.serverUpdates = serverUpdates;
    }

    return result;
  }

  private async validateAndSyncRecord(
    record: OfflineAttendanceRecordDto,
    userId: string,
    queryRunner: QueryRunner,
    sessionMap: Map<string, Session>
  ): Promise<void> {
    // Use cached session from batch prefetch
    const session = sessionMap.get(record.sessionId);
    if (!session) {
      const err = new NotFoundException(`Session ${record.sessionId} not found`);
      (err as any).syncErrorCode = 'SESSION_NOT_FOUND';
      throw err;
    }

    // Validate student is enrolled
    const sessionStudent = await queryRunner.manager.findOne(SessionStudent, {
      where: {
        session_id: record.sessionId,
        student_number: record.studentNumber,
      },
    });
    if (!sessionStudent) {
      const err = new BadRequestException(`Student ${record.studentNumber} is not registered for session ${record.sessionId}`);
      (err as any).syncErrorCode = 'STUDENT_NOT_REGISTERED';
      throw err;
    }

    const markedAt = new Date(record.markedAt);
    if (Number.isNaN(markedAt.getTime())) {
      const err = new BadRequestException(`Invalid markedAt timestamp: ${record.markedAt}`);
      (err as any).syncErrorCode = 'INVALID_TIMESTAMP';
      throw err;
    }

    // LWW: Check for existing record
    const existingRecord = await queryRunner.manager.findOne(AttendanceRecord, {
      where: {
        session_id: record.sessionId,
        session_student_id: sessionStudent.id,
      },
    });

    if (existingRecord) {
      const incomingTime = markedAt.getTime();
      const existingTime = existingRecord.marked_at ? existingRecord.marked_at.getTime() : 0;

      if (incomingTime > existingTime) {
        // Incoming is NEWER, update (Last-Write-Wins)
        existingRecord.status = record.status;
        existingRecord.method = record.method;
        existingRecord.marked_at = markedAt;
        existingRecord.remarks = record.remarks || null;
        existingRecord.marked_by = userId;
        await queryRunner.manager.save(existingRecord);
      }
      return;
    }

    // No existing record , create new
    const attendanceRecord = queryRunner.manager.create(AttendanceRecord, {
      session_id: record.sessionId,
      session_student_id: sessionStudent.id,
      status: record.status,
      method: record.method,
      marked_at: markedAt,
      remarks: record.remarks || null,
      marked_by: userId,
    });

    await queryRunner.manager.save(attendanceRecord);
  }

  private async getServerUpdates(
    lastSyncTimestamp: string,
    sessionIds: string[]
  ): Promise<AttendanceRecord[]> {
    if (!sessionIds.length) return [];

    return this.attendanceRepo
      .createQueryBuilder("record")
      .where("record.session_id IN (:...sessionIds)", { sessionIds })
      .andWhere("record.updated_at > :since", {
        since: new Date(lastSyncTimestamp)
      })
      .getMany();
  }
}
