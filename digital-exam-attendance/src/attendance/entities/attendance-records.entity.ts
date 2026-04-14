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

@Entity('attendance_records')
@Unique(['session_id', 'student_id'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, (session) => session.attendance_records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  session_id: string;

  @ManyToOne(() => SessionStudent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_student_id' })
  session_student: SessionStudent;

  @Column({ name: 'session_student_id' })
  session_student_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'student_id' })
  student_id: string;

  @Column({ length: 20, default: 'absent' })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'marked_by' })
  marked_by_user: User;

  @Column({ name: 'marked_by', nullable: true })
  marked_by: string;

  @Column({ name: 'marked_at', type: 'timestamp', nullable: true })
  marked_at: Date;

  @Column({ length: 20, nullable: true })
  method: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
