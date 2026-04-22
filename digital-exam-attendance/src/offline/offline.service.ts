import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-records.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { SyncOfflineDto, OfflineAttendanceRecordDto } from './dto/sync-offline.dto';

interface SyncResult {
  successCount: number;
  failureCount: number;
  failures: Array<{
    localId: string;
    reason: string;
  }>;
}

@Injectable()
export class OfflineService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(SessionStudent)
    private sessionStudentRepo: Repository<SessionStudent>,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async syncOfflineRecords(syncDto: SyncOfflineDto): Promise<SyncResult> {
    if (!syncDto.offlineRecords || syncDto.offlineRecords.length === 0) {
      throw new BadRequestException('No offline records provided');
    }

    const result: SyncResult = {
      successCount: 0,
      failureCount: 0,
      failures: [],
    };

    // Process each offline record
    for (const record of syncDto.offlineRecords) {
      try {
        await this.validateAndSyncRecord(record);
        result.successCount++;
      } catch (error) {
        result.failureCount++;
        result.failures.push({
          localId: record.localId,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  private async validateAndSyncRecord(record: OfflineAttendanceRecordDto): Promise<void> {
    // Step 1: Validate session exists
    const session = await this.sessionRepo.findOne({
      where: { id: record.sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session ${record.sessionId} not found`);
    }

    // Step 2: Validate student is registered for this session
    const sessionStudent = await this.sessionStudentRepo.findOne({
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
    const existingRecord = await this.attendanceRepo.findOne({
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
    const attendanceRecord = this.attendanceRepo.create({
      session_id: record.sessionId,
      student_id: record.studentId,
      session_student_id: sessionStudent.id,
      status: record.status,
      method: record.method,
      marked_at: new Date(record.markedAt),
      remarks: record.remarks || null,
      marked_by: null, // Offline scan, no specific invigilator
    });

    await this.attendanceRepo.save(attendanceRecord);
  }
}
