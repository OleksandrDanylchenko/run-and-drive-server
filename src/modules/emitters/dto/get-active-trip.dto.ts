import { Trip } from '@trips/entities/trip.entity';

export class GetActiveTripDto {
  tripId?: Trip['id'];
  startTime?: Trip['startTime'];
}
