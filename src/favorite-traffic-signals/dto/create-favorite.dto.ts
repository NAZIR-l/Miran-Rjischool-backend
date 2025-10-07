import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFavoriteDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	signalId: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(200)
	signalName: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	signalType: string;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	signalImageUrl?: string; // Now stores just the signal ID (e.g., "trw1", "geb5")
}

