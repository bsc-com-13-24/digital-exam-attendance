import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'student_number', length: 50, unique: true, nullable: true })
  student_number!: string;

  @Column({ name: 'staff_id', length: 50, unique: true, nullable: true })
  staff_id!: string;

  @Column({ name: 'first_name', length: 100 })
  first_name!: string;

  @Column({ name: 'last_name', length: 100 })
  last_name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar2', length: 500 })
  password_hash!: string;

  @Column({ name: 'is_active', default: true })
  is_active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  roles!: UserRole[];
}
