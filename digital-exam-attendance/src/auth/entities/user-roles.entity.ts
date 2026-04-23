import { Entity, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';
import { Role } from './roles.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn('uuid')
  user_id!: string;

  @PrimaryColumn('uuid')
  role_id!: string;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role, (role) => role.user_roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @CreateDateColumn({ name: 'assigned_at' })
  assigned_at!: Date;
}
