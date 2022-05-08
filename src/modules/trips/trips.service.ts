import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '@auth/users.service';
import { CarsService } from '@cars/cars.service';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { Trip } from '@trips/entities/trip.entity';
import { TripsRepository } from '@trips/entities/trip.repository';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripsRepository)
    private tripsRepository: TripsRepository,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  async get(tripId: string): Promise<Trip> {
    return this.tripsRepository.getTrip(tripId);
  }

  async create(dto: CreateTripDto) {
    const { carId, userId } = dto;
    const car = await this.carsService.get(carId);
    const user = await this.usersService.get(userId);

    return this.tripsRepository.createTrip(dto, car, user);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} sensor`;
  // }
  //
  // update(id: number, updateSensorDto: UpdateSensorDto) {
  //   return `This action updates a #${id} sensor`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} sensor`;
  // }
}
