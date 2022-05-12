export interface GetTestTripDto {
  id: string;
  name: string;
  locations: google.maps.LatLngLiteral[];
  totalDistance: number;
}
