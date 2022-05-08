import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '@auth/users.service';
import { CarsService } from '@cars/cars.service';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { UpdateTripStageDto } from '@trips/dto/update-trip-stage.dto';
import { Trip, TripStages } from '@trips/entities/trip.entity';
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

  async updateStage(tripId: string, dto: UpdateTripStageDto): Promise<Trip> {
    const trip = await this.get(tripId);

    if (dto.stage === TripStages.end && !trip.endTime) {
      throw new BadRequestException(
        `The trip ${tripId} hasn't been finished yet to update the "end" stage`,
      );
    }

    await this.tripsRepository.updateTripStage(tripId, dto);
    return this.get(tripId);
  }

  remove(tripId: string) {
    return this.tripsRepository.removeTrip(tripId);
  }
}
