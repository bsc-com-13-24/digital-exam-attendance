import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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

  @ManyToOne(() => Course, (course) => course.sessions)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column({ name: 'course_id' })
  course_id!: string;

  @ManyToOne(() => Room, (room) => room.sessions, { nullable: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'room_id', nullable: true })
  room_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by_user!: User;

  @Column({ name: 'created_by' })
  created_by!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @OneToMany(() => SessionStudent, (sessionStudent) => sessionStudent.session)
  students!: SessionStudent[];

  @OneToMany(() => AttendanceRecord, (record) => record.session)
  attendance_records!: AttendanceRecord[];
}
