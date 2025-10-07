import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteTrafficSignalsService } from './favorite-traffic-signals.service.js';
import { FavoriteTrafficSignalsController } from './favorite-traffic-signals.controller.js';
import { FavoriteTrafficSignal } from '../entities/favorite-traffic-signal.entity.js';

@Module({
	imports: [TypeOrmModule.forFeature([FavoriteTrafficSignal])],
	controllers: [FavoriteTrafficSignalsController],
	providers: [FavoriteTrafficSignalsService],
	exports: [FavoriteTrafficSignalsService],
})
export class FavoriteTrafficSignalsModule {}

