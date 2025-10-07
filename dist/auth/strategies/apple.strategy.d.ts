import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-apple';
declare const AppleStrategy_base: new (...args: any) => any;
export declare class AppleStrategy extends AppleStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): {
        provider: string;
        providerId: any;
        email: any;
        firstName: any;
        lastName: any;
    };
}
export {};
