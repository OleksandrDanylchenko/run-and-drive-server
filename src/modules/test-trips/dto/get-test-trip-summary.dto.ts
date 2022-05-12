export class GetTestTripSummaryDto {
  id: string;
  name: string;
  startLocation: google.maps.LatLngLiteral;
  endLocation: google.maps.LatLngLiteral;
  totalDistance: number;
}
