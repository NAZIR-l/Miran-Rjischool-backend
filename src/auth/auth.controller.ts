import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './dto/sign-up.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { User } from '../entities/user.entity.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signUp(@Body() dto: SignUpDto) {
		return this.authService.signUp(dto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() _dto: SignInDto, @GetUser() user: User) {
		return this.authService.signIn({ email: user.email, password: _dto.password });
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout() {
		return this.authService.logout();
	}

	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	async forgotPassword(@Body('email') email: string) {
		return this.authService.forgotPassword(email);
	}

	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	async resetPassword(
		@Body('token') token: string,
		@Body('newPassword') newPassword: string,
	) {
		return this.authService.resetPassword(token, newPassword);
	}

	@UseGuards(JwtAuthGuard)
	@Post('change-password')
	@HttpCode(HttpStatus.OK)
	async changePassword(
		@GetUser() user: User,
		@Body('currentPassword') currentPassword: string,
		@Body('newPassword') newPassword: string,
	) {
		return this.authService.changePassword(user.id, currentPassword, newPassword);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async me(@GetUser() user: User) {
		return user;
	}

	// Google OAuth
	@UseGuards(AuthGuard('google'))
	@Get('google')
	async googleAuth() {
		return;
	}

	@UseGuards(AuthGuard('google'))
	@Get('google/callback')
	async googleCallback(@Req() req: any) {
		return this.authService.oauthLogin(req.user);
	}

	// Apple OAuth
	@UseGuards(AuthGuard('apple'))
	@Get('apple')
	async appleAuth() {
		return;
	}

	@UseGuards(AuthGuard('apple'))
	@Post('apple/callback')
	async appleCallback(@Req() req: any) {
		return this.authService.oauthLogin(req.user);
	}
}
