import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from './sessions.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 20 })
  code!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ name: 'is_active', default: true })
  is_active!: boolean;

  @OneToMany(() => Session, (session) => session.course)
  sessions!: Session[];
}
