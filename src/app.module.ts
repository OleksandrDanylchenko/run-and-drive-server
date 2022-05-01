import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configValidationSchema } from '@config/config.schema';
import mongoDataSource from '@config/mongo-data-source.config';
import pgDataSource from '@config/pg-data-source.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRoot(pgDataSource.options),
    TypeOrmModule.forRoot(mongoDataSource.options),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
