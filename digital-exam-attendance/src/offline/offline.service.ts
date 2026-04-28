import { Injectable, BadRequestException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { SyncOfflineDto, OfflineAttendanceRecordDto, SyncResult} from './dto/sync-offline.dto';

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

  async syncOfflineRecords(syncDto: SyncOfflineDto): Promise<SyncResult> {
    if (!syncDto.offlineRecords || syncDto.offlineRecords.length === 0) {
      throw new BadRequestException('No offline records provided');
    }

    this.logger.log(`Starting sync for device ${syncDto.deviceId} with ${syncDto.offlineRecords.length} records`);

    const result: SyncResult = {
      successCount: 0,
      failureCount: 0,
      failures: [],
    };

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

  private async validateAndSyncRecord(record: OfflineAttendanceRecordDto, queryRunner: any): Promise<void> {
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
        student_id: record.studentId,
      },
    });
    if (!sessionStudent) {
      throw new BadRequestException(
        `Student ${record.studentId} is not registered for session ${record.sessionId}`,
      );
    }

    // Step 3: Check if attendance record already exists (prevent duplicates)
    const existingRecord = await queryRunner.manager.findOne(AttendanceRecord, {
      where: {
        session_id: record.sessionId,
        student_id: record.studentId,
      },
    });
    if (existingRecord) {
      throw new ConflictException(
        `Attendance already recorded for student ${record.studentId} in session ${record.sessionId}`,
      );
    }

    // Step 4: Create and save the attendance record
    const attendanceRecord = queryRunner.manager.create(AttendanceRecord, {
      session_id: record.sessionId,
      student_id: record.studentId,
      session_student_id: sessionStudent.id,
      status: record.status,
      method: record.method,
      marked_at: new Date(record.markedAt),
      remarks: record.remarks || null,
      marked_by: null, // Offline scan, no specific invigilator
    });

    await queryRunner.manager.save(attendanceRecord);
  }
}
