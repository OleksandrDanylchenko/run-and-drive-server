import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { CarsModule } from '@cars/cars.module';
import { TypeOrmExModule } from '@database/typeorm-ex.module';
import { SensorsRepository } from '@sensors/entities/sensors-record.repository';
import { TripsRepository } from '@trips/entities/trip.repository';
import { TripsController } from '@trips/trips.controller';
import { TripsService } from '@trips/trips.service';

@Module({
  imports: [
    CarsModule,
    AuthModule,
    TypeOrmExModule.forCustomRepository([TripsRepository, SensorsRepository]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
