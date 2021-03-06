import { IsNull, LessThan, Repository } from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { SensorsRecord } from '@sensors/entities/sensors-record.entity';
import { Trip } from '@trips/entities/trip.entity';
import { getPointFromLiteral } from '@utils/geo-jsob.helper';

@CustomRepository(SensorsRecord)
export class SensorsRepository extends Repository<SensorsRecord> {
  async getPreviousTripRecord(
    timestamp: Date,
    tripId: string,
  ): Promise<SensorsRecord | undefined> {
    return this.findOne({
      where: {
        trip: {
          id: tripId,
        },
        timestamp: LessThan(timestamp),
      },
      order: {
        timestamp: 'DESC',
      },
      loadRelationIds: true,
    });
  }

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
      fuelTankOccupancy: Math.trunc(fuelTankOccupancy),
      wheelsPressure,
      timestamp,
    });
    return this.save(sensorsRecord);
  }

  async replaceRecord(
    dto: CreateSensorsRecordDto,
    car: Car,
  ): Promise<SensorsRecord> {
    const { location, fuelTankOccupancy, wheelsPressure, timestamp } = dto;

    debugger;

    // First emitter record
    const existingRecord = await this.findOne({
      where: {
        car: {
          id: car.id,
        },
        trip: IsNull(),
      },
      loadRelationIds: true,
    });
    if (!existingRecord) {
      return this.createRecord(dto, car);
    }
    if (existingRecord.timestamp >= timestamp) {
      return existingRecord;
    }

    existingRecord.location = getPointFromLiteral(location);
    existingRecord.fuelTankOccupancy = Math.trunc(fuelTankOccupancy);
    existingRecord.wheelsPressure = wheelsPressure;
    existingRecord.timestamp = timestamp;
    return this.save(existingRecord);
  }
}
