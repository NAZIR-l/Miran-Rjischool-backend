import { FavoriteTrafficSignalsService } from './favorite-traffic-signals.service.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';
import { User } from '../entities/user.entity.js';
export declare class FavoriteTrafficSignalsController {
    private readonly favoriteTrafficSignalsService;
    constructor(favoriteTrafficSignalsService: FavoriteTrafficSignalsService);
    create(user: User, createFavoriteDto: CreateFavoriteDto): Promise<import("../entities/favorite-traffic-signal.entity.js").FavoriteTrafficSignal>;
    findAll(user: User): Promise<import("../entities/favorite-traffic-signal.entity.js").FavoriteTrafficSignal[]>;
    count(user: User): Promise<number>;
    findBySignalId(user: User, signalId: string): Promise<import("../entities/favorite-traffic-signal.entity.js").FavoriteTrafficSignal | null>;
    findOne(user: User, id: string): Promise<import("../entities/favorite-traffic-signal.entity.js").FavoriteTrafficSignal>;
    update(user: User, id: string, updateFavoriteDto: UpdateFavoriteDto): Promise<import("../entities/favorite-traffic-signal.entity.js").FavoriteTrafficSignal>;
    remove(user: User, id: string): Promise<void>;
    removeBySignalId(user: User, signalId: string): Promise<void>;
}
