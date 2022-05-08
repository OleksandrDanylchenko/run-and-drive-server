import { Point } from 'geojson';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { User } from '@auth/entities/user.entity';
import { Car } from '@cars/entities/car.entity';
import { SensorsRecord } from '@sensors/entities/sensors-record.entity';

export enum TripStages {
  'START' = 'START',
  'END' = 'END',
}

@Entity('trips', {
  orderBy: {
    endTime: {
      order: 'DESC',
      nulls: 'NULLS FIRST',
    },
  },
})
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.trips)
  @JoinColumn([{ name: 'car_id' }])
  car: Car;

  @RelationId((trip: Trip) => trip.car, 'car_id')
  car_id: string;

  @ManyToOne(() => User, (users) => users.trips)
  @JoinColumn([{ name: 'user_id' }])
  user: User;

  @RelationId((trip: Trip) => trip.user, 'user_id')
  user_id: string;

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

  @OneToMany(() => SensorsRecord, (sensorsRecord) => sensorsRecord.car)
  sensorsRecords: SensorsRecord[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
