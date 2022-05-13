import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { LessThanOrEqual } from 'typeorm';

import { CarsService } from '@cars/cars.service';
import { Car } from '@cars/entities/car.entity';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { SensorsRecord } from '@sensors/entities/sensors-record.entity';
import { SensorsRepository } from '@sensors/entities/sensors-record.repository';
import { Trip } from '@trips/entities/trip.entity';
import { TripsRepository } from '@trips/entities/trip.repository';
import { TripsService } from '@trips/trips.service';
import { getLiteralFromPoint } from '@utils/geo-jsob.helper';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(SensorsRepository)
    private sensorsRepository: SensorsRepository,
    @InjectRepository(TripsRepository)
    private tripsRepository: TripsRepository,
    private carsService: CarsService,
    private tripsService: TripsService,
  ) {}

  async createRecord(dto: CreateSensorsRecordDto): Promise<SensorsRecord> {
    const { carId } = dto;
    const car = await this.carsService.get(carId);
    const activeTrip = await this.tripsRepository.getActiveTripForCar(carId);

    /**
     * For the cars that are not in the trip we can store only one last record
     */
    return activeTrip
      ? this.createTripRecord(dto, car, activeTrip)
      : this.sensorsRepository.replaceRecord(dto, car);
  }

  async createTripRecord(
    dto: CreateSensorsRecordDto,
    car: Car,
    trip: Trip,
  ): Promise<SensorsRecord> {
    const { id: tripId, totalDistance, startLocation } = trip;

    const newRecord = await this.sensorsRepository.createRecord(dto, car, trip);
    const { location } = newRecord;
    const newLocationLatLng = getLiteralFromPoint(location);

    let newTotalDistance = totalDistance;

    if (!totalDistance) {
      const startLocationLatLng = getLiteralFromPoint(startLocation);
      newTotalDistance += computeDistanceBetween(
        newLocationLatLng,
        startLocationLatLng,
      );
    }

    const previousRecord = await this.sensorsRepository.getPreviousTripRecord(
      dto.timestamp,
      tripId,
    );
    if (previousRecord) {
      const { location: prevLocation } = previousRecord;
      const prevLocationLatLng = getLiteralFromPoint(prevLocation);

      newTotalDistance += computeDistanceBetween(
        newLocationLatLng,
        prevLocationLatLng,
      );
    }

    await this.tripsRepository.update(
      {
        id: tripId,
      },
      {
        totalDistance: newTotalDistance,
      },
    );
    return newRecord;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleCleanupCron() {
    const oneWeekBefore = DateTime.now().minus({ weeks: 1 });

    const expiredRecords = await this.sensorsRepository.find({
      where: {
        trip: {
          endTime: LessThanOrEqual(oneWeekBefore.toJSDate()),
        },
      },
      relations: {
        trip: true,
      },
    });

    await this.sensorsRepository.remove(expiredRecords);
  }
}
