import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Session } from '../../session/entities/sessions.entity';
import { User } from '../../auth/entities/users.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 20 })
  room_code!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true })
  building!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ name: 'is_active', default: true })
  is_active!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator_user!: User;

  @Column({ name: 'creator_id' })
  creator_id!: string;

  @Column({ name: 'created_by', length: 255 })
  created_by!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @OneToMany(() => Session, (session) => session.room)
  sessions!: Session[];
}
