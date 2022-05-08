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
  user: GetUserDto;
  car: GetCarDto;
}
