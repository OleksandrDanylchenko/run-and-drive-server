import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
}
