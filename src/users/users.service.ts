import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity.js';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOneById(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async createUser(data: Partial<User>): Promise<User> {
		if (!data.email || !data.password || !data.firstName || !data.lastName) {
			throw new BadRequestException('Missing required fields');
		}
		const exists = await this.userRepository.findOne({ where: { email: data.email } });
		if (exists) throw new BadRequestException('Email already in use');
		const user = this.userRepository.create({
			...data,
			status: data.status ?? UserStatus.ACTIVE,
		});
		return this.userRepository.save(user);
	}

	async deleteUser(id: string): Promise<void> {
		const res = await this.userRepository.delete(id);
		if (!res.affected) throw new NotFoundException('User not found');
	}
}
