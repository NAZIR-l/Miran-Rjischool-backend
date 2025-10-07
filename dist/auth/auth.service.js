"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_js_1 = require("../entities/user.entity.js");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async signUp(payload) {
        const exists = await this.userRepository.findOne({ where: { email: payload.email } });
        if (exists) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const user = this.userRepository.create({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            password: payload.password,
            phone: payload.phone ?? null,
            dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
            address: payload.address ?? null,
            postalCode: payload.postalCode ?? null,
            city: payload.city ?? null,
            country: payload.country ?? null,
            status: user_entity_js_1.UserStatus.ACTIVE,
        });
        await this.userRepository.save(user);
        const token = await this.issueToken(user);
        return { user, token };
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            return null;
        const ok = await user.comparePassword(password);
        if (!ok)
            return null;
        return user;
    }
    async validateUserById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async signIn(payload) {
        const user = await this.validateUser(payload.email, payload.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        const token = await this.issueToken(user);
        return { user, token };
    }
    async logout() {
        return { success: true };
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return { success: true };
        }
        user.passwordResetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60);
        await this.userRepository.save(user);
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepository.findOne({ where: { passwordResetToken: token } });
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        user.password = newPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await this.userRepository.save(user);
        return { success: true };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const ok = await user.comparePassword(currentPassword);
        if (!ok)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        user.password = newPassword;
        await this.userRepository.save(user);
        return { success: true };
    }
    async oauthLogin(profile) {
        const user = await this.upsertOAuthUser(profile);
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        const token = await this.issueToken(user);
        return { user, token };
    }
    async upsertOAuthUser(profile) {
        let user = null;
        if (profile.provider === 'google') {
            user = await this.userRepository.findOne({ where: [{ googleId: profile.providerId }, { email: profile.email ?? '' }] });
        }
        else if (profile.provider === 'apple') {
            user = await this.userRepository.findOne({ where: [{ appleId: profile.providerId }, { email: profile.email ?? '' }] });
        }
        if (!user) {
            user = this.userRepository.create({
                googleId: profile.provider === 'google' ? profile.providerId : null,
                appleId: profile.provider === 'apple' ? profile.providerId : null,
                email: profile.email || `${profile.provider}_${profile.providerId}@placeholder.local`,
                firstName: profile.firstName || profile.provider,
                lastName: profile.lastName || 'user',
                status: user_entity_js_1.UserStatus.ACTIVE,
                password: null,
            });
            return this.userRepository.save(user);
        }
        if (profile.provider === 'google' && !user.googleId)
            user.googleId = profile.providerId;
        if (profile.provider === 'apple' && !user.appleId)
            user.appleId = profile.providerId;
        return this.userRepository.save(user);
    }
    async issueToken(user) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.signAsync(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_js_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map