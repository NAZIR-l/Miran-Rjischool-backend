import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { FavoriteTrafficSignalsModule } from './favorite-traffic-signals/favorite-traffic-signals.module.js';
import { ProgramsModule } from './programs/programs.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { QuestionsModule } from './questions/questions.module.js';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig] }),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				...configService.get('database'),
			}),
		}),
		AuthModule,
		UsersModule,
		FavoriteTrafficSignalsModule,
        ProgramsModule,
        PaymentsModule,
        QuestionsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
