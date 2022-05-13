import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmExModule } from '@/database/typeorm-ex.module';
import { AuthModule } from '@auth/auth.module';
import { CarsRepository } from '@cars/entities/car.repository';
import { EmittersController } from '@emitters/emitters.controller';
import { EmittersService } from '@emitters/emitters.service';
import { EmittersRepository } from '@emitters/entities/emitter.repository';
import { EngineersRepository } from '@engineers/entities/engineer.repository';
import { TripsRepository } from '@trips/entities/trip.repository';
import { TripsModule } from '@trips/trips.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TripsModule,
    JwtModule.register({}),
    TypeOrmExModule.forCustomRepository([
      EmittersRepository,
      EngineersRepository,
      TripsRepository,
      CarsRepository,
    ]),
  ],
  controllers: [EmittersController],
  providers: [EmittersService],
})
export class EmittersModule {}
