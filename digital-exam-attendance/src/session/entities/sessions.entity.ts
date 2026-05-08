import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/courses.entity';
import { SessionStudent } from './session-students.entity';
import { AttendanceRecord } from '../../attendance/entities/attendance-records.entity';
import { User } from '../../auth/entities/users.entity';
import { Room } from '../../rooms/entities/rooms.entity';
import { Exclude } from 'class-transformer';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ name: 'venue', length: 255 })
  venue!: string;

  @Column({ name: 'scheduled_start', type: 'timestamp' })
  scheduled_start!: Date;

  @Column({ name: 'scheduled_end', type: 'timestamp' })
  scheduled_end!: Date;

  @Column({ length: 20, default: 'upcoming' })
  status!: string;

  @ManyToMany(() => Course, (course) => course.sessions)
  @JoinTable({
    name: 'session_courses',
    joinColumn: { name: 'session_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' },
  })
  courses!: Course[];

  @ManyToOne(() => Room, (room) => room.sessions, { nullable: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Exclude()
  @Column({ name: 'room_id', nullable: true })
  room_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator_user!: User;

  @Exclude()
  @Column({ name: 'creator_id' })
  creator_id!: string;

  @Column({ name: 'created_by', length: 255 })
  created_by!: string;

  @Column({ type: 'int', nullable: true })
  expected_students?: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @OneToMany(() => SessionStudent, (sessionStudent) => sessionStudent.session)
  students!: SessionStudent[];

  @OneToMany(() => AttendanceRecord, (record) => record.session)
  attendance_records!: AttendanceRecord[];
}
