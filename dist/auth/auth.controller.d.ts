import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { User } from '../entities/user.entity.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(dto: SignUpDto): Promise<{
        user: User;
        token: string;
    }>;
    login(_dto: SignInDto, user: User): Promise<{
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
    changePassword(user: User, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    me(user: User): Promise<User>;
    googleAuth(): Promise<void>;
    googleCallback(req: any): Promise<{
        user: User;
        token: string;
    }>;
    appleAuth(): Promise<void>;
    appleCallback(req: any): Promise<{
        user: User;
        token: string;
    }>;
}
