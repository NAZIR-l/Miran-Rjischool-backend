import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { User } from '../entities/user.entity.js';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		return this.usersService.findOneById(id);
	}

	@Post()
	async create(@Body() data: Partial<User>): Promise<User> {
		return this.usersService.createUser(data);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<{ success: true }> {
		await this.usersService.deleteUser(id);
		return { success: true };
	}
}
