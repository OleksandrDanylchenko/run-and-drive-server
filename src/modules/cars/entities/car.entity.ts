import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Trip } from '@/modules/trips/entities/trip.entity';
import { ImgurEntityIds } from '@common/types';
import { Emitter } from '@emitters/entities/emitter.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Emitter, (emitter) => emitter.car, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Exclude({ toPlainOnly: true })
  emitter?: Emitter;

  @Index({ unique: true, where: 'cars.deleted_at IS NULL' })
  @Column({ length: 17 })
  vin: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 50 })
  model: string;

  @Column()
  year: number;

  @Column({ length: 50 })
  color: string;

  @Column({ type: 'json', nullable: true })
  album?: ImgurEntityIds;

  @Column()
  mileage: number;

  @Column({ name: 'engine_capacity', type: 'decimal', precision: 2, scale: 1 })
  engineCapacity: number;

  @Column({ name: 'fuel_capacity' })
  fuelCapacity: number;

  @OneToMany(() => Trip, (trip) => trip.car)
  trips: Trip[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
