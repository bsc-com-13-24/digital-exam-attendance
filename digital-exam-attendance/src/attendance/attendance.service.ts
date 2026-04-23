<<<<<<< HEAD
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-records.entity';
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

  async markAttendance(dto: CreateAttendanceDto): Promise<AttendanceRecord> {
    // Validate student is registered for the session
    const sessionStudent = await this.sessionStudentRepository.findOne({
      where: { id: dto.session_student_id, session_id: dto.session_id, student_id: dto.student_id },
    });
    if (!sessionStudent) {
      throw new BadRequestException('Student is not registered for this session');
    }

    // Check for duplicate entry
    const existing = await this.attendanceRepository.findOne({
      where: { session_id: dto.session_id, student_id: dto.student_id },
    });
    if (existing) {
      throw new ConflictException('Attendance already marked for this student in the session');
    }

    // Get session to check time
    const session = await this.sessionRepository.findOne({ where: { id: dto.session_id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const now = new Date();
    let status = dto.status;
    if (status === 'present' && now > session.scheduled_start) {
      status = 'late';
    }

    const record = this.attendanceRepository.create({
      ...dto,
      status,
      marked_at: now,
    });

    const saved = await this.attendanceRepository.save(record);

    // Log audit
    await this.logAudit(dto.marked_by || 'system', 'MARK_ATTENDANCE', 'attendance_record', saved.id);

    return saved;
  }

  async bulkMarkAttendance(dto: BulkMarkAttendanceDto): Promise<AttendanceRecord[]> {
    const records: AttendanceRecord[] = [];
    for (const recordDto of dto.records) {
      if (recordDto.session_id !== dto.session_id) {
        throw new BadRequestException('Session ID mismatch in bulk records');
      }
      const record = await this.markAttendance(recordDto);
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

    // Log audit
    await this.logAudit(updatedBy || 'system', 'UPDATE_ATTENDANCE', 'attendance_record', saved.id);

    return saved;
  }

  async getAttendanceRecords(query: AttendanceQueryDto): Promise<AttendanceRecord[]> {
    const qb = this.attendanceRepository.createQueryBuilder('record')
      .leftJoinAndSelect('record.session', 'session')
      .leftJoinAndSelect('record.student', 'student')
      .leftJoinAndSelect('record.session_student', 'session_student')
      .leftJoinAndSelect('record.marked_by_user', 'marked_by_user');

    if (query.session_id) {
      qb.andWhere('record.session_id = :session_id', { session_id: query.session_id });
    }
    if (query.student_id) {
      qb.andWhere('record.student_id = :student_id', { student_id: query.student_id });
    }
    if (query.status) {
      qb.andWhere('record.status = :status', { status: query.status });
    }
    if (query.method) {
      qb.andWhere('record.method = :method', { method: query.method });
    }
    if (query.course_id) {
      qb.andWhere('session.course_id = :course_id', { course_id: query.course_id });
    }

    return qb.getMany();
  }

  async getAttendanceReport(sessionId: string): Promise<{
    totalEnrolled: number;
    present: number;
    absent: number;
    late: number;
  }> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['students'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const totalEnrolled = session.students.length;

    const records = await this.attendanceRepository.find({
      where: { session_id: sessionId },
    });

    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;

    return { totalEnrolled, present, absent, late };
  }

  async searchStudentsForManualMark(sessionId: string, search: string): Promise<SessionStudent[]> {
    return this.sessionStudentRepository.createQueryBuilder('ss')
      .leftJoinAndSelect('ss.student', 'student')
      .where('ss.session_id = :sessionId', { sessionId })
      .andWhere('(ss.student_number ILIKE :search OR ss.full_name ILIKE :search OR student.email ILIKE :search)')
      .setParameters({ search: `%${search}%` })
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
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceService {}
>>>>>>> 1f4981e (Configured dtos and service for Offline module.)
