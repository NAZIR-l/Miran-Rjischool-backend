import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service.js';

export interface JwtPayload {
	sub: string;
	email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('jwt.secret'),
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.authService.validateUserById(payload.sub);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		if (!user.isActive) {
			throw new UnauthorizedException('Account is inactive');
		}
		return user;
	}
}
