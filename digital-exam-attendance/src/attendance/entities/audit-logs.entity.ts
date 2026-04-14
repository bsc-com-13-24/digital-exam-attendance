import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/users.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  user_id: string;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'entity_type', length: 50 })
  entity_type: string;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entity_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
