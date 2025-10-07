import { Repository } from 'typeorm';
import { FavoriteTrafficSignal } from '../entities/favorite-traffic-signal.entity.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
export declare class FavoriteTrafficSignalsService {
    private favoriteRepository;
    constructor(favoriteRepository: Repository<FavoriteTrafficSignal>);
    create(userId: string, createFavoriteDto: CreateFavoriteDto): Promise<FavoriteTrafficSignal>;
    findAll(userId: string): Promise<FavoriteTrafficSignal[]>;
    findOne(id: string, userId: string): Promise<FavoriteTrafficSignal>;
    findBySignalId(signalId: string, userId: string): Promise<FavoriteTrafficSignal | null>;
    update(id: string, userId: string, updateFavoriteDto: UpdateFavoriteDto): Promise<FavoriteTrafficSignal>;
    remove(id: string, userId: string): Promise<void>;
    removeBySignalId(signalId: string, userId: string): Promise<void>;
    count(userId: string): Promise<number>;
}
