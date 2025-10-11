import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramExample } from '../entities/program-example.entity.js';
import { QuestionsController } from './questions.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([ProgramExample])],
    controllers: [QuestionsController],
})
export class QuestionsModule {}


