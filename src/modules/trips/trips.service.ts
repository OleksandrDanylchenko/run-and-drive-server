import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '@auth/users.service';
import { CarsService } from '@cars/cars.service';
import { GetCarDto } from '@cars/dto/get-car.dto';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { GetTripDto } from '@trips/dto/get-trip.dto';
import { UpdateTripStageDto } from '@trips/dto/update-trip-stage.dto';
import { Trip, TripStages } from '@trips/entities/trip.entity';
import { TripsRepository } from '@trips/entities/trip.repository';
import { getLiteralFromPoint } from '@utils/geo-jsob.helper';

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

  async findOne(tripId: string): Promise<GetTripDto> {
    const {
      id,
      carId,
      userId,
      startLocation: startLocationPoint,
      startTime,
      endLocation: endLocationPoint,
      endTime,
    } = await this.get(tripId);

    const startLocation = getLiteralFromPoint(startLocationPoint);
    const endLocation = endLocationPoint
      ? getLiteralFromPoint(endLocationPoint)
      : undefined;

    const car = await this.carsService.findOne(carId);
    const user = await this.usersService.findOne(userId);

    return {
      id,
      start: {
        location: startLocation,
        time: startTime,
      },
      end: endLocation
        ? {
            location: endLocation,
            time: endTime,
          }
        : undefined,
      car,
      user,
    };
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
