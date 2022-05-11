import { Trip } from '@trips/entities/trip.entity';

export class GetActiveTripDto {
  trip?: {
    id: Trip['id'];
    startTime: Trip['startTime'];
  };
}
