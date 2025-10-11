import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Program } from '../entities/program.entity.js';
import { ProgramEnrollment, EnrollmentStatus } from '../entities/program-enrollment.entity.js';
import { Transaction, TransactionStatus } from '../entities/transaction.entity.js';
import { ProgramsService } from '../programs/programs.service.js';

// We will use Mollie's HTTP API directly to avoid adding heavy SDK deps
// Docs: https://docs.mollie.com/reference/v2/payments-api/create-payment

@Injectable()
export class PaymentsService {
    private readonly mollieApiKey: string | undefined;
    private readonly backendPublicUrl: string;
    private readonly portalPublicUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly programsService: ProgramsService,
        @InjectRepository(Program) private readonly programRepo: Repository<Program>,
        @InjectRepository(ProgramEnrollment) private readonly enrollmentRepo: Repository<ProgramEnrollment>,
        @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
    ) {
        this.mollieApiKey = this.configService.get('MOLLIE_API_KEY');
        this.backendPublicUrl = this.configService.get('BACKEND_PUBLIC_URL') || 'http://localhost:3001';
        this.portalPublicUrl = this.configService.get('PORTAL_PUBLIC_URL') || 'http://localhost:9000';
    }

    async startEnrollmentPayment(userId: string, programId: string): Promise<{ checkoutUrl: string }>
    {
        const program = await this.programRepo.findOne({ where: { id: programId } });
        if (!program || !program.isActive) throw new NotFoundException('Program not found');

        await this.programsService.upsertEnrollmentPending(userId, program);

        const tx = await this.programsService.createTransaction({
            userId,
            programId: program.id,
            amount: program.price,
            currency: program.currency,
            provider: 'mollie',
            status: TransactionStatus.PENDING,
        });

        const createResp = await fetch('https://api.mollie.com/v2/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.mollieApiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                amount: { currency: program.currency, value: this.formatAmount(program.price) },
                description: `Enrollment for ${program.name}`,
                redirectUrl: `${this.portalPublicUrl}/payment/return`,
                webhookUrl: `${this.backendPublicUrl}/payments/mollie/webhook`,
                metadata: { transactionId: tx.id, programId: program.id, userId },
            }),
        });
        const payload = (await createResp.json()) as any;
        const providerPaymentId = payload.id as string;
        const checkoutUrl = payload?._links?.checkout?.href as string;

        await this.programsService.updateTransactionByProviderId(providerPaymentId || '', {
            provider: 'mollie',
        });
        await this.txRepo.update({ id: tx.id }, { providerPaymentId });
        return { checkoutUrl };
    }

    async handleMollieWebhook(body: any): Promise<void> {
        const providerPaymentId = body?.id as string;
        if (!providerPaymentId) return;
        const paymentResp = await fetch(`https://api.mollie.com/v2/payments/${providerPaymentId}`, {
            headers: {
                'Authorization': `Bearer ${this.mollieApiKey}`,
                'Accept': 'application/json',
            },
        });
        const payment = (await paymentResp.json()) as any;
        const status = payment.status as string;
        const metadata = payment.metadata as any;

        if (status === 'paid') {
            await this.txRepo.update({ providerPaymentId }, { status: TransactionStatus.PAID, metadata });
            if (metadata?.userId && metadata?.programId) {
                await this.programsService.markEnrollmentActive(metadata.userId, metadata.programId);
            }
        } else if (status === 'failed' || status === 'canceled' || status === 'expired') {
            const map: Record<string, TransactionStatus> = {
                failed: TransactionStatus.FAILED,
                canceled: TransactionStatus.CANCELED,
                expired: TransactionStatus.EXPIRED,
            };
            await this.txRepo.update({ providerPaymentId }, { status: map[status] || TransactionStatus.FAILED, metadata });
        }
    }

    private formatAmount(value: string | number): string {
        const num = typeof value === 'string' ? Number(value) : value;
        return num.toFixed(2);
    }
}


