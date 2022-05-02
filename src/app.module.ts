import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { AtGuard } from '@common/guards';
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
