import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';

import { User } from '@auth/entities/user.entity';
import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { EndTripDto } from '@trips/dto/end-trip.dto';
import { FindAllFilterDto, TripState } from '@trips/dto/find-all-filter.dto';
import { UpdateTripStageDto } from '@trips/dto/update-trip-stage.dto';
import { Trip } from '@trips/entities/trip.entity';
import { getPointFromLiteral } from '@utils/geo-jsob.helper';

@CustomRepository(Trip)
export class TripsRepository extends Repository<Trip> {
  async getTrip(tripId: string, relations?: FindOneOptions<Trip>['relations']) {
    const trip = await this.findOne({
      where: { id: tripId },
      relations,
    });
    if (!trip) {
      throw new NotFoundException(`Trip ${tripId} cannot be found!`);
    }
    return trip;
  }

  async getTrips(
    filterDto: FindAllFilterDto,
    relations?: FindOneOptions<Trip>['relations'],
  ) {
    const { state = TripState.IN_PROGRESS } = filterDto;
    return this.find({
      where: {
        endTime: state === TripState.IN_PROGRESS ? IsNull() : Not(IsNull()),
      },
      relations,
    });
  }

  async createTrip(dto: CreateTripDto, car: Car, user: User): Promise<Trip> {
    const startLocation = getPointFromLiteral(dto.location);
    const trip = this.create({
      car,
      user,
      startLocation,
    });
    return this.save(trip);
  }

  async endTrip(tripId: string, dto: EndTripDto) {
    const locationPoint = getPointFromLiteral(dto.location);
    return this.update(
      { id: tripId },
      { endLocation: locationPoint, endTime: new Date() },
    );
  }

  async removeTrip(tripId: string): Promise<boolean> {
    const trip = await this.findOneBy({ id: tripId });
    if (!trip) return true;

    await this.softRemove([trip]);
    return true;
  }

  getActiveTripForCar(carId: string) {
    return this.findOne({
      where: {
        car: {
          id: carId,
        },
        endTime: IsNull(),
      },
      loadRelationIds: true,
    });
  }
}
