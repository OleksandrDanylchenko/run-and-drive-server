import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '@auth/entities/user.entity';
import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { UpdateTripStageDto } from '@trips/dto/update-trip-stage.dto';
import { Trip } from '@trips/entities/trip.entity';
import { getPointFromLiteral } from '@utils/geo-jsob.helper';

@CustomRepository(Trip)
export class TripsRepository extends Repository<Trip> {
  async getTrip(tripId: string) {
    const trip = await this.findOneBy({ id: tripId });
    if (!trip) {
      throw new NotFoundException(`Trip ${tripId} cannot be found!`);
    }
    return trip;
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

  async updateTripStage(tripId: string, dto: UpdateTripStageDto) {
    const { stage, location, time } = dto;
    const locationPoint = location ? getPointFromLiteral(location) : undefined;

    if (!location && !time) return;
    switch (stage) {
      case 'start': {
        return this.update(
          { id: tripId },
          { startLocation: locationPoint, startTime: time },
        );
      }
      case 'end': {
        return this.update(
          { id: tripId },
          { endLocation: locationPoint, endTime: time },
        );
      }
    }
  }
}
