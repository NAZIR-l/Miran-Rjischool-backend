import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramExample } from '../entities/program-example.entity.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

@Controller('questions')
export class QuestionsController {
    constructor(
        @InjectRepository(ProgramExample) private readonly exampleRepo: Repository<ProgramExample>,
    ) {}

    @Get(':exampleId')
    async getExampleQuestions(@Param('exampleId') exampleId: string, @Query('lang') lang?: string) {
        const example = await this.exampleRepo.findOne({ where: { id: exampleId } });
        if (!example || !example.questionsFile) throw new NotFoundException('Questions not found');
        const effectiveLang = (lang || 'en').toLowerCase();
        const base = example.questionsFile.endsWith('.json')
            ? example.questionsFile.slice(0, -5)
            : example.questionsFile;

        // Try language-specific file first: <base>.<lang>.json, then fallback to <base>.json
        const preferred = join(process.cwd(), 'questions', `${base}.${effectiveLang}.json`);
        const fallback = join(process.cwd(), 'questions', `${base}.json`);
        let content: string | null = null;
        try {
            content = await readFile(preferred, 'utf-8');
        } catch (_) {
            try {
                content = await readFile(fallback, 'utf-8');
            } catch {
                throw new NotFoundException('Questions file not found for requested language');
            }
        }
        return JSON.parse(content);
    }
}


