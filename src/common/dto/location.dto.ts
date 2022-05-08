import { IsLatitude, IsLongitude } from 'class-validator';

export class Location implements google.maps.LatLngLiteral {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
