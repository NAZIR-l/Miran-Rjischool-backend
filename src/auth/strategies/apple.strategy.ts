import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import AppleStrategyBase, { Profile } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(AppleStrategyBase, 'apple') {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>('APPLE_CLIENT_ID') as string,
			teamID: configService.get<string>('APPLE_TEAM_ID') as string,
			keyID: configService.get<string>('APPLE_KEY_ID') as string,
			callbackURL: configService.get<string>('APPLE_CALLBACK_URL') || 'http://localhost:3000/auth/apple/callback',
			privateKeyString: (configService.get<string>('APPLE_PRIVATE_KEY') || '').split('\\n').join('\n'),
			scope: ['name', 'email'],
		});
	}

	validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		const { id, emails, name } = profile as any;
		return {
			provider: 'apple',
			providerId: id,
			email: emails && emails.length > 0 ? emails[0].value : undefined,
			firstName: name?.firstName,
			lastName: name?.lastName,
		};
	}
}
