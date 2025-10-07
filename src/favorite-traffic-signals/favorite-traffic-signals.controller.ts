import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common';
import { FavoriteTrafficSignalsService } from './favorite-traffic-signals.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { User } from '../entities/user.entity.js';

@Controller('favorite-traffic-signals')
@UseGuards(JwtAuthGuard)
export class FavoriteTrafficSignalsController {
	constructor(private readonly favoriteTrafficSignalsService: FavoriteTrafficSignalsService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@GetUser() user: User, @Body() createFavoriteDto: CreateFavoriteDto) {
		return this.favoriteTrafficSignalsService.create(user.id, createFavoriteDto);
	}

	@Get()
	findAll(@GetUser() user: User) {
		return this.favoriteTrafficSignalsService.findAll(user.id);
	}

	@Get('count')
	count(@GetUser() user: User) {
		return this.favoriteTrafficSignalsService.count(user.id);
	}

	@Get('by-signal/:signalId')
	findBySignalId(@GetUser() user: User, @Param('signalId') signalId: string) {
		return this.favoriteTrafficSignalsService.findBySignalId(signalId, user.id);
	}

	@Get(':id')
	findOne(@GetUser() user: User, @Param('id') id: string) {
		return this.favoriteTrafficSignalsService.findOne(id, user.id);
	}

	@Patch(':id')
	update(
		@GetUser() user: User,
		@Param('id') id: string,
		@Body() updateFavoriteDto: UpdateFavoriteDto,
	) {
		return this.favoriteTrafficSignalsService.update(id, user.id, updateFavoriteDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@GetUser() user: User, @Param('id') id: string) {
		return this.favoriteTrafficSignalsService.remove(id, user.id);
	}

	@Delete('by-signal/:signalId')
	@HttpCode(HttpStatus.NO_CONTENT)
	removeBySignalId(@GetUser() user: User, @Param('signalId') signalId: string) {
		return this.favoriteTrafficSignalsService.removeBySignalId(signalId, user.id);
	}
}

