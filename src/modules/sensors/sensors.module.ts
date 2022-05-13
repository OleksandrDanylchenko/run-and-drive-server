import { Module } from '@nestjs/common';

import { CarsModule } from '@cars/cars.module';
import { TypeOrmExModule } from '@database/typeorm-ex.module';
import { SensorsRepository } from '@sensors/entities/sensors-record.repository';
import { SensorsController } from '@sensors/sensors.controller';
import { SensorsService } from '@sensors/sensors.service';
import { TripsRepository } from '@trips/entities/trip.repository';
import { TripsModule } from '@trips/trips.module';

@Module({
  imports: [
    CarsModule,
    SensorsModule,
    TripsModule,
    TypeOrmExModule.forCustomRepository([SensorsRepository, TripsRepository]),
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
