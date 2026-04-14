import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-roles.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ name: 'display_name', length: 100 })
  display_name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  user_roles: UserRole[];
}
