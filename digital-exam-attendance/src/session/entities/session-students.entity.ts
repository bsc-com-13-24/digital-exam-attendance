import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Session } from './sessions.entity';
import { User } from '../../auth/entities/users.entity';

@Entity('session_students')
@Unique(['session_id', 'student_id'])
export class SessionStudent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, (session) => session.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'session_id' })
  session_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'student_id' })
  student_id: string;

  @Column({ name: 'student_number', length: 50 })
  student_number: string;

  @Column({ name: 'full_name', length: 255 })
  full_name: string;

  @CreateDateColumn({ name: 'added_at' })
  added_at: Date;
}
