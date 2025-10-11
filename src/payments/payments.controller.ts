import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../entities/user.entity.js';
import express from 'express';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('enroll/:programId')
    async enrollAndPay(@Param('programId') programId: string, @GetUser() user: User) {
        return this.paymentsService.startEnrollmentPayment(user.id, programId);
    }

    // Mollie will call this endpoint (public)
    @Post('mollie/webhook')
    async mollieWebhook(@Req() req: express.Request, @Res() res: express.Response) {
        await this.paymentsService.handleMollieWebhook(req.body);
        res.status(200).send('OK');
    }
}


