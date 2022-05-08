import { Repository } from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { SensorsRecord } from '@sensors/entities/sensors-record.entity';
import { Trip } from '@trips/entities/trip.entity';
import { getPointFromLiteral } from '@utils/geo-jsob.helper';

@CustomRepository(SensorsRecord)
export class SensorsRepository extends Repository<SensorsRecord> {
  async createRecord(
    dto: CreateSensorsRecordDto,
    car: Car,
    trip?: Trip,
  ): Promise<SensorsRecord> {
    const { location, fuelTankOccupancy, wheelsPressure, timestamp } = dto;

    const locationPoint = getPointFromLiteral(location);
    const sensorsRecord = this.create({
      car,
      trip,
      location: locationPoint,
      fuelTankOccupancy,
      wheelsPressure,
      timestamp,
    });
    return this.save(sensorsRecord);
  }
}
