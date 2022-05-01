import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          host: configService.get('PG_DB_HOST'),
          port: configService.get('PG_DB_PORT'),
          username: configService.get('PG_DB_USERNAME'),
          password: configService.get('PG_DB_PASSWORD'),
          database: configService.get('PG_DB_DATABASE'),
          migrations: [configService.get('PG_DB_MIGRATIONS_FOLDER')],
          keepConnectionAlive: true,
        };
      },
    }),
  ],
})
export class PostgresDatabaseModule {}
