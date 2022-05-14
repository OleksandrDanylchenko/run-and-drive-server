import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'geojson';

import { UsersService } from '@auth/users.service';
import { CarsService } from '@cars/cars.service';
import { SensorsRepository } from '@sensors/entities/sensors-record.repository';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { FindAllFilterDto } from '@trips/dto/find-all-filter.dto';
import { GetTripDto } from '@trips/dto/get-trip.dto';
import { Trip } from '@trips/entities/trip.entity';
import { TripsRepository } from '@trips/entities/trip.repository';
import { getLiteralFromPoint } from '@utils/geo-jsob.helper';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripsRepository)
    private tripsRepository: TripsRepository,
    @InjectRepository(SensorsRepository)
    private sensorsRepository: SensorsRepository,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  async get(tripId: string): Promise<Trip> {
    return this.tripsRepository.getTrip(tripId);
  }

  async create(dto: CreateTripDto) {
    const { carId, userId } = dto;

    const activeTrip = await this.tripsRepository.getActiveTripForCar(carId);
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
      user_id,
      startLocation: startLocationPoint,
      startTime,
      endLocation: endLocationPoint,
      endTime,
      totalDistance,
    } = trip;

    const { id: carId, brand, model, color, year } = car;
    const user = await this.usersService.findOne(user_id);

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
        year,
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
      totalDistance,
    };
  }

  async endTrip(tripId: string): Promise<Trip> {
    const trip = await this.get(tripId);
    const lastRecord = await this.sensorsRepository.findOne({
      where: {
        trip: {
          id: tripId,
        },
      },
      order: {
        timestamp: 'DESC',
      },
      loadRelationIds: true,
    });

    const endOptions: { endLocation: Point; endTime: Date } = lastRecord
      ? {
          endLocation: lastRecord.location,
          endTime: lastRecord.timestamp,
        }
      : {
          endLocation: trip.startLocation,
          endTime: trip.startTime,
        };
    await this.tripsRepository.endTrip(tripId, endOptions);
    return this.get(tripId);
  }

  remove(tripId: string) {
    return this.tripsRepository.removeTrip(tripId);
  }
}
