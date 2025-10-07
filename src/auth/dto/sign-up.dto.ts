import { IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(2)
	@MaxLength(100)
	firstName: string;

	@IsString()
	@MinLength(2)
	@MaxLength(100)
	lastName: string;

	@IsString()
	@MinLength(8)
	@MaxLength(100)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
		message:
			'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
	})
	password: string;

	@IsOptional()
	@IsPhoneNumber('NL')
	phone?: string;

	@IsOptional()
	@IsDateString()
	dateOfBirth?: string;

	@IsOptional()
	@IsString()
	@MaxLength(255)
	address?: string;

	@IsOptional()
	@IsString()
	@MaxLength(10)
	postalCode?: string;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	city?: string;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	country?: string;
}
