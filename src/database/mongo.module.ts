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
          name: 'mongo-run-and-drive',
          ssl: isProduction,
          type: 'mongodb',
          host: configService.get('MONGO_DB_HOST'),
          port: configService.get('MONGO_DB_PORT'),
          username: configService.get('MONGO_DB_USERNAME'),
          password: configService.get('MONGO_DB_PASSWORD'),
          database: configService.get('MONGO_DB_DATABASE'),
        };
      },
    }),
  ],
})
export class MongoDatabaseModule {}
