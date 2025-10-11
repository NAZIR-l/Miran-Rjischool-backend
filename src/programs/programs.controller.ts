import { Body, Controller, Get, NotFoundException, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../entities/user.entity.js';
import { Response } from 'express';

@Controller('programs')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) {}

    @Get()
    async listPrograms() {
        return this.programsService.listActivePrograms();
    }

    @Get(':id')
    async programDetails(@Param('id') id: string) {
        const program = await this.programsService.getProgramWithExamples(id);
        if (!program) throw new NotFoundException('Program not found');
        return program;
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/list')
    async myPrograms(@GetUser() user: User) {
        return this.programsService.listMyPrograms(user.id);
    }
}


