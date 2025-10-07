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
exports.FavoriteTrafficSignalsController = void 0;
const common_1 = require("@nestjs/common");
const favorite_traffic_signals_service_js_1 = require("./favorite-traffic-signals.service.js");
const create_favorite_dto_js_1 = require("./dto/create-favorite.dto.js");
const update_favorite_dto_js_1 = require("./dto/update-favorite.dto.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const get_user_decorator_js_1 = require("../auth/decorators/get-user.decorator.js");
const user_entity_js_1 = require("../entities/user.entity.js");
let FavoriteTrafficSignalsController = class FavoriteTrafficSignalsController {
    favoriteTrafficSignalsService;
    constructor(favoriteTrafficSignalsService) {
        this.favoriteTrafficSignalsService = favoriteTrafficSignalsService;
    }
    create(user, createFavoriteDto) {
        return this.favoriteTrafficSignalsService.create(user.id, createFavoriteDto);
    }
    findAll(user) {
        return this.favoriteTrafficSignalsService.findAll(user.id);
    }
    count(user) {
        return this.favoriteTrafficSignalsService.count(user.id);
    }
    findBySignalId(user, signalId) {
        return this.favoriteTrafficSignalsService.findBySignalId(signalId, user.id);
    }
    findOne(user, id) {
        return this.favoriteTrafficSignalsService.findOne(id, user.id);
    }
    update(user, id, updateFavoriteDto) {
        return this.favoriteTrafficSignalsService.update(id, user.id, updateFavoriteDto);
    }
    remove(user, id) {
        return this.favoriteTrafficSignalsService.remove(id, user.id);
    }
    removeBySignalId(user, signalId) {
        return this.favoriteTrafficSignalsService.removeBySignalId(signalId, user.id);
    }
};
exports.FavoriteTrafficSignalsController = FavoriteTrafficSignalsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, create_favorite_dto_js_1.CreateFavoriteDto]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('by-signal/:signalId'),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Param)('signalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, String]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "findBySignalId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, String]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, String, update_favorite_dto_js_1.UpdateFavoriteDto]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, String]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('by-signal/:signalId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, get_user_decorator_js_1.GetUser)()),
    __param(1, (0, common_1.Param)('signalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_js_1.User, String]),
    __metadata("design:returntype", void 0)
], FavoriteTrafficSignalsController.prototype, "removeBySignalId", null);
exports.FavoriteTrafficSignalsController = FavoriteTrafficSignalsController = __decorate([
    (0, common_1.Controller)('favorite-traffic-signals'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    __metadata("design:paramtypes", [favorite_traffic_signals_service_js_1.FavoriteTrafficSignalsService])
], FavoriteTrafficSignalsController);
//# sourceMappingURL=favorite-traffic-signals.controller.js.map