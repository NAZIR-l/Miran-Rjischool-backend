import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity.js';

export enum EnrollmentStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
}

@Entity('program_enrollments')
@Unique(['userId', 'programId'])
export class ProgramEnrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid' })
    programId: string;

    @ManyToOne('Program', (program: any) => program.enrollments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'programId' })
    program: any;

    @Column({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.PENDING })
    status: EnrollmentStatus;

    @CreateDateColumn()
    createdAt: Date;
}


