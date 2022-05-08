import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not } from 'typeorm';

import { UsersService } from '@auth/users.service';
import { CarsService } from '@cars/cars.service';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { EndTripDto } from '@trips/dto/end-trip.dto';
import { FindAllFilterDto } from '@trips/dto/find-all-filter.dto';
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

    const activeTrip = await this.tripsRepository.findOneBy({
      carId,
      endTime: Not(IsNull()),
    });
    if (activeTrip) {
      throw new BadRequestException(
        "Cannot star trip for the car that's already in use!",
      );
    }

    const car = await this.carsService.get(carId);
    const user = await this.usersService.get(userId);

    return this.tripsRepository.createTrip(dto, car, user);
  }

  async findAll(filterDto: FindAllFilterDto): Promise<GetTripDto[]> {
    const trips = await this.tripsRepository.getTrips(filterDto, { car: true });
    return Promise.all(trips.map((trip) => this.createTripDto(trip)));
  }

  async findOne(tripId: string): Promise<GetTripDto> {
    const trip = await this.tripsRepository.getTrip(tripId, { car: true });
    return this.createTripDto(trip);
  }

  async createTripDto(trip: Trip) {
    const {
      id,
      car,
      userId,
      startLocation: startLocationPoint,
      startTime,
      endLocation: endLocationPoint,
      endTime,
    } = trip;

    const { id: carId, brand, model, color } = car;
    const user = await this.usersService.findOne(userId);

    const startLocation = getLiteralFromPoint(startLocationPoint);
    const endLocation = endLocationPoint
      ? getLiteralFromPoint(endLocationPoint)
      : undefined;

    return {
      id,
      car: {
        id: carId,
        brand,
        model,
        color,
      },
      user,
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
    };
  }

  async updateStage(tripId: string, dto: UpdateTripStageDto): Promise<Trip> {
    const trip = await this.get(tripId);

    if (dto.stage === TripStages.END && !trip.endTime) {
      throw new BadRequestException(
        `The trip ${tripId} hasn't been finished yet to update the "end" stage`,
      );
    }

    await this.tripsRepository.updateTripStage(tripId, dto);
    return this.get(tripId);
  }

  async endTrip(tripId: string, dto: EndTripDto): Promise<Trip> {
    await this.tripsRepository.endTrip(tripId, dto);
    return this.get(tripId);
  }

  remove(tripId: string) {
    return this.tripsRepository.removeTrip(tripId);
  }
}
