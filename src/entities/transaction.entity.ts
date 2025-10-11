import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity.js';

export enum TransactionStatus {
    CREATED = 'created',
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
    REFUNDED = 'refunded',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid', nullable: true })
    programId: string | null;

    @ManyToOne('Program', { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'programId' })
    program: any | null;

    @Column({ type: 'varchar', length: 160, nullable: true })
    provider: string | null; // e.g. 'mollie'

    @Column({ type: 'varchar', length: 200, nullable: true })
    providerPaymentId: string | null; // mollie payment id

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: string;

    @Column({ type: 'varchar', length: 3, default: 'EUR' })
    currency: string;

    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.CREATED })
    status: TransactionStatus;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, unknown> | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


