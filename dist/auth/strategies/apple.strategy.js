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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_apple_1 = __importDefault(require("passport-apple"));
let AppleStrategy = class AppleStrategy extends (0, passport_1.PassportStrategy)(passport_apple_1.default, 'apple') {
    configService;
    constructor(configService) {
        super({
            clientID: configService.get('APPLE_CLIENT_ID'),
            teamID: configService.get('APPLE_TEAM_ID'),
            keyID: configService.get('APPLE_KEY_ID'),
            callbackURL: configService.get('APPLE_CALLBACK_URL') || 'http://localhost:3000/auth/apple/callback',
            privateKeyString: (configService.get('APPLE_PRIVATE_KEY') || '').split('\\n').join('\n'),
            scope: ['name', 'email'],
        });
        this.configService = configService;
    }
    validate(_accessToken, _refreshToken, profile) {
        const { id, emails, name } = profile;
        return {
            provider: 'apple',
            providerId: id,
            email: emails && emails.length > 0 ? emails[0].value : undefined,
            firstName: name?.firstName,
            lastName: name?.lastName,
        };
    }
};
exports.AppleStrategy = AppleStrategy;
exports.AppleStrategy = AppleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppleStrategy);
//# sourceMappingURL=apple.strategy.js.map