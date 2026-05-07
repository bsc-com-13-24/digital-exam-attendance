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

@Entity('session_students')
@Unique(['session_id', 'student_number'])
export class SessionStudent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Session, (session) => session.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session!: Session;

  @Column({ name: 'session_id' })
  session_id!: string;

  @Column({ name: 'student_number', length: 50 })
  student_number!: string;

  @Column({ name: 'full_name', length: 255 })
  full_name!: string;

  @CreateDateColumn({ name: 'added_at' })
  added_at!: Date;
}
