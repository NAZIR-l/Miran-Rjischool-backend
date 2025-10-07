import {
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteTrafficSignal } from '../entities/favorite-traffic-signal.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

@Injectable()
export class FavoriteTrafficSignalsService {
	constructor(
		@InjectRepository(FavoriteTrafficSignal)
		private favoriteRepository: Repository<FavoriteTrafficSignal>,
	) {}

	async create(userId: string, createFavoriteDto: CreateFavoriteDto): Promise<FavoriteTrafficSignal> {
		// Check if the signal is already in favorites
		const existing = await this.favoriteRepository.findOne({
			where: {
				userId,
				signalId: createFavoriteDto.signalId,
			},
		});

		if (existing) {
			throw new ConflictException('This traffic signal is already in your favorites');
		}

		const favorite = this.favoriteRepository.create({
			userId,
			...createFavoriteDto,
		});

		return this.favoriteRepository.save(favorite);
	}

	async findAll(userId: string): Promise<FavoriteTrafficSignal[]> {
		return this.favoriteRepository.find({
			where: { userId },
			order: { createdAt: 'DESC' },
		});
	}

	async findOne(id: string, userId: string): Promise<FavoriteTrafficSignal> {
		const favorite = await this.favoriteRepository.findOne({
			where: { id, userId },
		});

		if (!favorite) {
			throw new NotFoundException('Favorite traffic signal not found');
		}

		return favorite;
	}

	async findBySignalId(signalId: string, userId: string): Promise<FavoriteTrafficSignal | null> {
		return this.favoriteRepository.findOne({
			where: { userId, signalId },
		});
	}

	async update(
		id: string,
		userId: string,
		updateFavoriteDto: UpdateFavoriteDto,
	): Promise<FavoriteTrafficSignal> {
		const favorite = await this.findOne(id, userId);

		Object.assign(favorite, updateFavoriteDto);
		return this.favoriteRepository.save(favorite);
	}

	async remove(id: string, userId: string): Promise<void> {
		const favorite = await this.findOne(id, userId);
		await this.favoriteRepository.remove(favorite);
	}

	async removeBySignalId(signalId: string, userId: string): Promise<void> {
		const favorite = await this.favoriteRepository.findOne({
			where: { userId, signalId },
		});

		if (!favorite) {
			throw new NotFoundException('Favorite traffic signal not found');
		}

		await this.favoriteRepository.remove(favorite);
	}

	async count(userId: string): Promise<number> {
		return this.favoriteRepository.count({
			where: { userId },
		});
	}
}

