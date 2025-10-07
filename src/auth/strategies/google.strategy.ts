import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
			clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
			callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/auth/google/callback',
			scope: ['email', 'profile'],
		});
	}

	validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		const { id, emails, name } = profile;
		return {
			provider: 'google',
			providerId: id,
			email: emails && emails.length > 0 ? emails[0].value : undefined,
			firstName: name?.givenName,
			lastName: name?.familyName,
		};
	}
}
