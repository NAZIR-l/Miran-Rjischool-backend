import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity.js';
import { SignUpDto } from './dto/sign-up.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async signUp(payload: SignUpDto) {
		const exists = await this.userRepository.findOne({ where: { email: payload.email } });
		if (exists) {
			throw new BadRequestException('Email already in use');
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
			status: UserStatus.ACTIVE,
		});
		await this.userRepository.save(user);
		const token = await this.issueToken(user);
		return { user, token };
	}

	async validateUser(email: string, password: string) {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) return null;
		const ok = await user.comparePassword(password);
		if (!ok) return null;
		return user;
	}

	async validateUserById(id: string) {
		return this.userRepository.findOne({ where: { id } });
	}

	async signIn(payload: SignInDto) {
		const user = await this.validateUser(payload.email, payload.password);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		user.lastLoginAt = new Date();
		await this.userRepository.save(user);
		const token = await this.issueToken(user);
		return { user, token };
	}

	async logout() {
		return { success: true };
	}

	async forgotPassword(email: string) {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			return { success: true };
		}
		user.passwordResetToken = crypto.randomBytes(32).toString('hex');
		user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60);
		await this.userRepository.save(user);
		return { success: true };
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.userRepository.findOne({ where: { passwordResetToken: token } });
		if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
			throw new BadRequestException('Invalid or expired token');
		}
		user.password = newPassword;
		user.passwordResetToken = null;
		user.passwordResetExpires = null;
		await this.userRepository.save(user);
		return { success: true };
	}

	async changePassword(userId: string, currentPassword: string, newPassword: string) {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');
		const ok = await user.comparePassword(currentPassword);
		if (!ok) throw new UnauthorizedException('Current password is incorrect');
		user.password = newPassword;
		await this.userRepository.save(user);
		return { success: true };
	}

	async oauthLogin(profile: { provider: 'google' | 'apple'; providerId: string; email?: string; firstName?: string; lastName?: string; }) {
		const user = await this.upsertOAuthUser(profile);
		user.lastLoginAt = new Date();
		await this.userRepository.save(user);
		const token = await this.issueToken(user);
		return { user, token };
	}

	private async upsertOAuthUser(profile: { provider: 'google' | 'apple'; providerId: string; email?: string; firstName?: string; lastName?: string; }): Promise<User> {
		let user: User | null = null;
		if (profile.provider === 'google') {
			user = await this.userRepository.findOne({ where: [{ googleId: profile.providerId }, { email: profile.email ?? '' }] });
		} else if (profile.provider === 'apple') {
			user = await this.userRepository.findOne({ where: [{ appleId: profile.providerId }, { email: profile.email ?? '' }] });
		}
		if (!user) {
			user = this.userRepository.create({
				googleId: profile.provider === 'google' ? profile.providerId : null,
				appleId: profile.provider === 'apple' ? profile.providerId : null,
				email: profile.email || `${profile.provider}_${profile.providerId}@placeholder.local`,
				firstName: profile.firstName || profile.provider,
				lastName: profile.lastName || 'user',
				status: UserStatus.ACTIVE,
				password: null,
			});
			return this.userRepository.save(user);
		}
		// Update linkage if found by email but missing provider id
		if (profile.provider === 'google' && !user.googleId) user.googleId = profile.providerId;
		if (profile.provider === 'apple' && !user.appleId) user.appleId = profile.providerId;
		return this.userRepository.save(user);
	}

	private async issueToken(user: User) {
		const payload = { sub: user.id, email: user.email };
		return this.jwtService.signAsync(payload);
	}
}
