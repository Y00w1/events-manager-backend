import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Load environment variables from .env file globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Validate required environment variables to prevent undefined values
        const dbUser = configService.get('DB_USER');
        const dbPassword = configService.get('DB_PASSWORD');
        const dbName = configService.get('DB_NAME');
        const dbHost = configService.get('DB_HOST', 'localhost');
        const dbPort = configService.get('DB_PORT', 3306);

        if (!dbUser || !dbPassword || !dbName) {
          throw new Error(
            'Missing required database environment variables: DB_USER, DB_PASSWORD, DB_NAME'
          );
        }

        return {
          type: 'mysql' as const,
          // All required fields now have validated non-undefined values
          host: dbHost,
          port: dbPort,
          username: dbUser,
          password: dbPassword, 
          database: dbName,
          // Auto-scan for entities in src directory
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // WARNING: Only for development! Use migrations in production
          synchronize: configService.get('NODE_ENV') === 'development',
          // Log only errors and warnings in development
          logging: ['error', 'warn'],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
