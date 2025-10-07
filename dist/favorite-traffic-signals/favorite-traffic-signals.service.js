"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteTrafficSignalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_traffic_signal_entity_js_1 = require("../entities/favorite-traffic-signal.entity.js");
let FavoriteTrafficSignalsService = class FavoriteTrafficSignalsService {
    favoriteRepository;
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }
    async create(userId, createFavoriteDto) {
        const existing = await this.favoriteRepository.findOne({
            where: {
                userId,
                signalId: createFavoriteDto.signalId,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('This traffic signal is already in your favorites');
        }
        const favorite = this.favoriteRepository.create({
            userId,
            ...createFavoriteDto,
        });
        return this.favoriteRepository.save(favorite);
    }
    async findAll(userId) {
        return this.favoriteRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const favorite = await this.favoriteRepository.findOne({
            where: { id, userId },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite traffic signal not found');
        }
        return favorite;
    }
    async findBySignalId(signalId, userId) {
        return this.favoriteRepository.findOne({
            where: { userId, signalId },
        });
    }
    async update(id, userId, updateFavoriteDto) {
        const favorite = await this.findOne(id, userId);
        Object.assign(favorite, updateFavoriteDto);
        return this.favoriteRepository.save(favorite);
    }
    async remove(id, userId) {
        const favorite = await this.findOne(id, userId);
        await this.favoriteRepository.remove(favorite);
    }
    async removeBySignalId(signalId, userId) {
        const favorite = await this.favoriteRepository.findOne({
            where: { userId, signalId },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite traffic signal not found');
        }
        await this.favoriteRepository.remove(favorite);
    }
    async count(userId) {
        return this.favoriteRepository.count({
            where: { userId },
        });
    }
};
exports.FavoriteTrafficSignalsService = FavoriteTrafficSignalsService;
exports.FavoriteTrafficSignalsService = FavoriteTrafficSignalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_traffic_signal_entity_js_1.FavoriteTrafficSignal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FavoriteTrafficSignalsService);
//# sourceMappingURL=favorite-traffic-signals.service.js.map