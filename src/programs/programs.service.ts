import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Program } from '../entities/program.entity.js';
import { ProgramExample } from '../entities/program-example.entity.js';
import { ProgramEnrollment, EnrollmentStatus } from '../entities/program-enrollment.entity.js';
import { Transaction, TransactionStatus } from '../entities/transaction.entity.js';

@Injectable()
export class ProgramsService {
    constructor(
        @InjectRepository(Program) private readonly programRepo: Repository<Program>,
        @InjectRepository(ProgramExample) private readonly exampleRepo: Repository<ProgramExample>,
        @InjectRepository(ProgramEnrollment) private readonly enrollmentRepo: Repository<ProgramEnrollment>,
        @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>,
    ) {}

    async listActivePrograms(): Promise<Program[]> {
        return this.programRepo.find({ where: { isActive: true }, order: { orderIndex: 'ASC' } });
    }

    async getProgramWithExamples(programId: string): Promise<any | null> {
        const program = await this.programRepo.findOne({ where: { id: programId } });
        if (!program) return null;
        const examples = await this.exampleRepo.find({ where: { programId }, order: { orderIndex: 'ASC' } });
        return { ...program, examples };
    }

    async listMyPrograms(userId: string): Promise<Program[]> {
        const enrollments = await this.enrollmentRepo.find({ where: { userId, status: EnrollmentStatus.ACTIVE } });
        if (enrollments.length === 0) return [];
        const programIds = enrollments.map((e) => e.programId);
        return this.programRepo.findBy({ id: In(programIds) });
    }

    async upsertEnrollmentPending(userId: string, program: Program): Promise<ProgramEnrollment> {
        let enrollment = await this.enrollmentRepo.findOne({ where: { userId, programId: program.id } });
        if (!enrollment) {
            enrollment = this.enrollmentRepo.create({ userId, programId: program.id, status: EnrollmentStatus.PENDING });
        } else {
            enrollment.status = EnrollmentStatus.PENDING;
        }
        return this.enrollmentRepo.save(enrollment);
    }

    async markEnrollmentActive(userId: string, programId: string): Promise<void> {
        await this.enrollmentRepo.update({ userId, programId }, { status: EnrollmentStatus.ACTIVE });
    }

    async createTransaction(params: {
        userId: string;
        programId: string;
        amount: string;
        currency: string;
        provider: string;
        providerPaymentId?: string | null;
        status?: TransactionStatus;
        metadata?: Record<string, unknown> | null;
    }): Promise<Transaction> {
        const tx = this.transactionRepo.create({
            userId: params.userId,
            programId: params.programId,
            amount: params.amount,
            currency: params.currency,
            provider: params.provider,
            providerPaymentId: params.providerPaymentId ?? null,
            status: params.status ?? TransactionStatus.CREATED,
            metadata: params.metadata ?? null,
        });
        return this.transactionRepo.save(tx);
    }

    async updateTransactionByProviderId(providerPaymentId: string, updates: Partial<Transaction>): Promise<void> {
        await this.transactionRepo.update({ providerPaymentId }, updates);
    }
}


