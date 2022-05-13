import { GetUserDto } from '@auth/dto/get-user.dto';
import { GetCarDto } from '@cars/dto/get-car.dto';

export class GetTripDto {
  id: string;
  start: {
    location: google.maps.LatLngLiteral;
    time: Date;
  };
  end?: {
    location: google.maps.LatLngLiteral;
    time: Date;
  };
  totalDistance: number;
  user: TripUserDto;
  car: TripCarDto;
}

export type TripUserDto = GetUserDto;

export type TripCarDto = Pick<GetCarDto, 'id' | 'brand' | 'model' | 'color'>;
