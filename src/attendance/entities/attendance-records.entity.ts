import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';
import { SessionStudent } from '../../session/entities/session-students.entity';

export enum AttendanceStatus{
  PRESENT = 'present',
  LATE = 'late',
  ABSENT = 'absent',
  COMPLETED = 'completed',
}

@Entity('attendance_records')
@Unique(['session_id', 'student_number'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Session, (session) => session.attendance_records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session!: Session;

  @Column({ name: 'session_id' })
  session_id!: string;

  @ManyToOne(() => SessionStudent, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'session_id', referencedColumnName: 'session_id' },
    { name: 'student_number', referencedColumnName: 'student_number' }
  ])
  session_student!: SessionStudent;

  @Column({ name: 'student_number', length: 50 })
  student_number!: string;

  @Column({ 
    type: 'varchar2',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
   })
  status!: AttendanceStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'marked_by' })
  marked_by_user!: User;

  @Column({ name: 'marked_by', type: 'varchar2', length: 100, nullable: true })
  marked_by?: string | null;

  @Column({ name: 'marked_at', type: 'timestamp', nullable: true })
  marked_at?: Date | null;

  @Column({ type: 'varchar2', length: 20, nullable: true })
  method?: string | null;

  @Column({ type: 'clob', nullable: true })
  remarks?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
