import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { Program } from '../entities/program.entity.js';
import { ProgramEnrollment } from '../entities/program-enrollment.entity.js';
import { Transaction } from '../entities/transaction.entity.js';
import { ProgramsModule } from '../programs/programs.module.js';

@Module({
    imports: [
        ConfigModule,
        ProgramsModule,
        TypeOrmModule.forFeature([Program, ProgramEnrollment, Transaction]),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}


