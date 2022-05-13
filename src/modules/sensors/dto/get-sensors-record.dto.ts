export interface GetSensorsRecordDto {
  id: string;
  carId: string;
  tripId?: string;
  fuelTankOccupancy: number;
  location: google.maps.LatLngLiteral;
  wheelsPressure?: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  timestamp: string;
}
