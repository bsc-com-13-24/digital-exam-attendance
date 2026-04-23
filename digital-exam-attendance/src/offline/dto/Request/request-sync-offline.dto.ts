// dto/request/request-sync-offline.dto.ts

import { IsString } from "class-validator";
import { User } from "src/auth/entities/users.entity";
import {Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class OfflineRecordDto{
    @IsString()
    local_id!: string;
    
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({name: 'session_student_id'})  
    session_id!: string;

    @ManyToOne(()=>User)
    @JoinColumn({name: 'student_id'})
    student!: User;

    @Column({name: 'student_id'})
    student_id!: string;

    @Column({length: 20, default: 'absent'})
    status!: "present" | "completed" | "absent";

    @Column({length: 20, nullable: true})
    method!: "scan"|"manual";
   
    @Column({ name: 'completed_at', nullable: true})
    completedAt?: string;

    @Column({ type: 'clob', nullable:true})
    remarks?: string;

    @Column({ name: 'marked_by', nullable: true})
    marked_by!: string;

    @Column({ name: 'marked_at', type: 'timestamp', nullable: true})
    marked_at!: Date;

    @JoinColumn({name: 'marked_by'})
    marked_by_user!: User;

    @Column({ name: 'device_id', nullable: true})
    device_id!: string;

    @CreateDateColumn({name: 'created_at'})
    created_at!: Date;

    @UpdateDateColumn({name: 'update_at'})
    updated_at!: Date;
}

export class equestSyncOfflineDto{
    device_id!:string;
    OfflineRecords!: OfflineRecordDto[];
}