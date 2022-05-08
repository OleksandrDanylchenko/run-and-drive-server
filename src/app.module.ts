import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { CarsModule } from '@cars/cars.module';
import { AtGuard } from '@common/guards';
import { configValidationSchema } from '@config/config.schema';
import mongoDataSource from '@config/mongo-data-source.config';
import pgDataSource from '@config/pg-data-source.config';
import { EmittersModule } from '@emitters/emitters.module';
import { EngineersModule } from '@engineers/engineers.module';
import { TripsModule } from '@trips/trips.module';

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
    EngineersModule,
    EmittersModule,
    CarsModule,
    TripsModule,
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
