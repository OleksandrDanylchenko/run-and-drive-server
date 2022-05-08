import { Point } from 'geojson';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { Trip } from '@trips/entities/trip.entity';

export interface WheelsPressure {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
}

@Entity('sensors_records')
export class SensorsRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.sensorsRecords)
  @JoinColumn([{ name: 'car_id' }])
  car: Car;

  @RelationId((sensorsRecord: SensorsRecord) => sensorsRecord.car, 'car_id')
  carId: string;

  @ManyToOne(() => Trip, (trip) => trip.sensorsRecords)
  @JoinColumn([{ name: 'trip_id' }])
  trip: Trip;

  @RelationId((sensorsRecord: SensorsRecord) => sensorsRecord.trip, 'trip_id')
  tripId: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @Column({ name: 'fuel_tank_occupancy' })
  fuelTankOccupancy: number;

  @Column({ name: 'wheels_pressure', type: 'json', nullable: true })
  wheelsPressure?: WheelsPressure;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
