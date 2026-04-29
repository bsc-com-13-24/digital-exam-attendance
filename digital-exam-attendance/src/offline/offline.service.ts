import { Injectable, BadRequestException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
<<<<<<< HEAD
import { SyncOfflineDto, OfflineAttendanceRecordDto, SyncResult} from './dto/sync-offline.dto';
=======
import { SyncOfflineDto, OfflineAttendanceRecordDto } from './dto/sync-offline.dto';

export interface SyncResult {
  successCount: number;
  failureCount: number;
  failures: Array<{
    localId: string;
    reason: string;
  }>;
}
>>>>>>> 71a0675e6087e7dcf5d55f6a87edb92958d8d2a6

@Injectable()
export class OfflineService {
  private readonly logger = new Logger(OfflineService.name);

  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(SessionStudent)
    private sessionStudentRepo: Repository<SessionStudent>,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    private dataSource: DataSource,
  ) {}

  async syncOfflineRecords(syncDto: SyncOfflineDto, userId: string): Promise<SyncResult> {
    if (!syncDto.offlineRecords || syncDto.offlineRecords.length === 0) {
      throw new BadRequestException('No offline records provided');
    }

    this.logger.log(`Starting sync for device ${syncDto.deviceId} with ${syncDto.offlineRecords.length} records`);

    const result: SyncResult = {
      successCount: 0,
      failureCount: 0,
      failures: [],
    };

<<<<<<< HEAD
    // Use transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Process each offline record
      for (const record of syncDto.offlineRecords) {
        try {
          await this.validateAndSyncRecord(record, queryRunner);
          result.successCount++;
          this.logger.debug(`Successfully synced record: ${record.localId}`);
        } catch (error) {
          result.failureCount++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.failures.push({
            localId: record.localId,
            reason: errorMessage,
          });
          this.logger.warn(`Failed to sync record ${record.localId}: ${errorMessage}`);
        }
=======
    // Process each offline record
    for (const record of syncDto.offlineRecords) {
      try {
        await this.validateAndSyncRecord(record, userId);
        result.successCount++;
      } catch (error) {
        result.failureCount++;
        result.failures.push({
          localId: record.localId,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
>>>>>>> 71a0675e6087e7dcf5d55f6a87edb92958d8d2a6
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Sync completed - Success: ${result.successCount}, Failures: ${result.failureCount}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Sync transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Sync operation failed, all changes rolled back');
    } finally {
      await queryRunner.release();
    }

    return result;
  }

<<<<<<< HEAD
  private async validateAndSyncRecord(record: OfflineAttendanceRecordDto, queryRunner: any): Promise<void> {
=======
  private async validateAndSyncRecord(record: OfflineAttendanceRecordDto, userId: string): Promise<void> {
>>>>>>> 71a0675e6087e7dcf5d55f6a87edb92958d8d2a6
    // Step 1: Validate session exists
    const session = await queryRunner.manager.findOne(Session, {
      where: { id: record.sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session ${record.sessionId} not found`);
    }

    // Step 2: Validate student is registered for this session
    const sessionStudent = await queryRunner.manager.findOne(SessionStudent, {
      where: {
        session_id: record.sessionId,
        student_number: record.studentNumber,
      },
    });
    if (!sessionStudent) {
      throw new BadRequestException(
        `Student ${record.studentNumber} is not registered for session ${record.sessionId}`,
      );
    }

    // Step 3: Check if attendance record already exists (prevent duplicates)
    const existingRecord = await queryRunner.manager.findOne(AttendanceRecord, {
      where: {
        session_id: record.sessionId,
        session_student_id: sessionStudent.id,
      },
    });
    if (existingRecord) {
      throw new ConflictException(
        `Attendance already recorded for student ${record.studentNumber} in session ${record.sessionId}`,
      );
    }

    // Step 4: Create and save the attendance record
    const attendanceRecord = queryRunner.manager.create(AttendanceRecord, {
      session_id: record.sessionId,
      session_student_id: sessionStudent.id,
      status: record.status,
      method: record.method,
      marked_at: new Date(record.markedAt),
      remarks: record.remarks || null,
      marked_by: userId, // User who performed the sync
    });

    await queryRunner.manager.save(attendanceRecord);
  }
}
