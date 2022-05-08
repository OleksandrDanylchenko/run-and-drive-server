import { Point } from 'geojson';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { User } from '@auth/entities/user.entity';
import { Car } from '@cars/entities/car.entity';

export enum TripStages {
  'START' = 'START',
  'END' = 'END',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.trips)
  @JoinColumn([{ name: 'car_id' }])
  car: Car;

  @RelationId((trip: Trip) => trip.car, 'car_id')
  carId: string;

  @ManyToOne(() => User, (users) => users.trips)
  @JoinColumn([{ name: 'user_id' }])
  user: User;

  @RelationId((trip: Trip) => trip.user, 'user_id')
  userId: string;

  @Index({ spatial: true })
  @Column({
    name: 'start_location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  startLocation: Point;

  @CreateDateColumn({ name: 'start_time' })
  startTime: Date;

  @Index({ spatial: true })
  @Column({
    name: 'end_location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  endLocation?: Point;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime?: Date;

  // Stored in meters
  @Column({ name: 'total_distance', default: 0 })
  totalDistance: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
