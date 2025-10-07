import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { SignUpDto } from './dto/sign-up.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    signUp(payload: SignUpDto): Promise<{
        user: User;
        token: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    validateUserById(id: string): Promise<User | null>;
    signIn(payload: SignInDto): Promise<{
        user: User;
        token: string;
    }>;
    logout(): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    oauthLogin(profile: {
        provider: 'google' | 'apple';
        providerId: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        user: User;
        token: string;
    }>;
    private upsertOAuthUser;
    private issueToken;
}
