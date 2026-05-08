import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by_user!: User;

  @Column({ name: 'created_by' })
  created_by!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @ManyToMany(() => Session, (session) => session.courses)
  sessions!: Session[];
}
