import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { In, IsNull, LessThanOrEqual } from 'typeorm';

import { CarsService } from '@cars/cars.service';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { SensorsRepository } from '@sensors/entities/sensors-record.repository';
import { TripsRepository } from '@trips/entities/trip.repository';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(SensorsRepository)
    private sensorsRepository: SensorsRepository,
    @InjectRepository(TripsRepository)
    private tripsRepository: TripsRepository,
    private carsService: CarsService,
  ) {}

  async createRecord(dto: CreateSensorsRecordDto) {
    const { carId } = dto;
    const car = await this.carsService.get(carId);
    const activeTrip = await this.tripsRepository.getActiveTripForCar(carId);
    return this.sensorsRepository.createRecord(dto, car, activeTrip);
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
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
