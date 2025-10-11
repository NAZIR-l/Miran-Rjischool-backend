import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../entities/program.entity.js';
import { ProgramExample } from '../entities/program-example.entity.js';
import { ProgramEnrollment } from '../entities/program-enrollment.entity.js';
import { Transaction } from '../entities/transaction.entity.js';
import { ProgramsService } from './programs.service.js';
import { ProgramsController } from './programs.controller.js';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Program, ProgramExample, ProgramEnrollment, Transaction]),
    ],
    controllers: [ProgramsController],
    providers: [ProgramsService],
    exports: [ProgramsService],
})
export class ProgramsModule {}


