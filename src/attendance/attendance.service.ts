import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord, AttendanceStatus } from './entities/attendance-records.entity';
import { AuditLog } from './entities/audit-logs.entity';
import { SessionStudent } from '../session/entities/session-students.entity';
import { Session } from '../session/entities/sessions.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkMarkAttendanceDto } from './dto/bulk-mark-attendance.dto';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(SessionStudent)
    private readonly sessionStudentRepository: Repository<SessionStudent>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async markAttendance(dto: CreateAttendanceDto, userId: string): Promise<AttendanceRecord> {
  const sessionStudent = await this.sessionStudentRepository.findOne({
    where: { student_number: dto.student_number, session_id: dto.session_id },
  });
  if (!sessionStudent) throw new BadRequestException('Student is not registered for this session');

  const session = await this.sessionRepository.findOne({ where: { id: dto.session_id } });
  if (!session) throw new NotFoundException('Session not found');

  const existing = await this.attendanceRepository.findOne({
    where: { session_id: dto.session_id, student_number: dto.student_number },
  });

  const now = new Date();

  if (!existing) {
    // First scan → PRESENT or LATE
    const status = now > session.scheduled_start ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    const record = this.attendanceRepository.create({ 
      ...dto, 
      status, 
      marked_at: now,
      marked_by: userId
    });
    const saved = await this.attendanceRepository.save(record);
    await this.logAudit(userId || dto.marked_by || 'system', 'MARK_ATTENDANCE', 'attendance_record', saved.id);
    return saved;
  }

  if (existing.status === AttendanceStatus.COMPLETED) {
    throw new ConflictException('Student has already completed this session');
  }

  // Second scan → update to COMPLETED
  existing.status = AttendanceStatus.COMPLETED;
  existing.marked_at = now;
  const saved = await this.attendanceRepository.save(existing);
  await this.logAudit(userId || dto.marked_by || 'system', 'MARK_ATTENDANCE', 'attendance_record', saved.id);
  return saved;
}

  async bulkMarkAttendance(dto: BulkMarkAttendanceDto, userId: string): Promise<AttendanceRecord[]> {
    const records: AttendanceRecord[] = [];
    for (const recordDto of dto.records) {
      const record = await this.markAttendance({
        ...recordDto,
        session_id: dto.session_id,
      } as any, userId);
      records.push(record);
    }
    return records;
  }

  async updateAttendance(id: string, dto: UpdateAttendanceDto, updatedBy?: string): Promise<AttendanceRecord> {
    const record = await this.attendanceRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('Attendance record not found');
    }

    Object.assign(record, dto);
    record.marked_at = new Date();

    const saved = await this.attendanceRepository.save(record);

    // audit log
    await this.logAudit(updatedBy || 'system', 'UPDATE_ATTENDANCE', 'attendance_record', saved.id);

    return saved;
  }

  async getAttendanceRecords(query: AttendanceQueryDto): Promise<AttendanceRecord[]> {
    const qb = this.attendanceRepository.createQueryBuilder('record')
      .leftJoinAndSelect('record.session', 'session')
      .leftJoinAndSelect('record.session_student', 'session_student')
      .leftJoinAndSelect('record.marked_by_user', 'marked_by_user');

    if (query.session_id) {
      qb.andWhere('record.session_id = :session_id', { session_id: query.session_id });
    }
    if (query.student_number) {
      qb.andWhere('session_student.student_number = :student_number', { student_number: query.student_number });
    }
    if (query.status) {
      qb.andWhere('record.status = :status', { status: query.status });
    }
    if (query.method) {
      qb.andWhere('record.method = :method', { method: query.method });
    }
    if (query.course_id) {
      qb.innerJoin('session.courses', 'course', 'course.id = :course_id', {
        course_id: query.course_id,
      });
    }

    return qb.getMany();
  }


  async searchStudentsForManualMark(sessionId: string, search: string): Promise<SessionStudent[]> {
    const upperSearch = `%${search.toUpperCase()}%`;
    return this.sessionStudentRepository.createQueryBuilder('ss')
      .where('ss.session_id = :sessionId', { sessionId })
      .andWhere(
        '(UPPER(ss.student_number) LIKE :search OR UPPER(ss.full_name) LIKE :search)',
        { search: upperSearch },
      )
      .getMany();
  }

  private async logAudit(userId: string, action: string, entityType: string, entityId: string): Promise<void> {
    const log = this.auditLogRepository.create({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
    });
    await this.auditLogRepository.save(log);
  }
}
