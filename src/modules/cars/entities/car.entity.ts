import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Emitter } from '@emitters/entities/emitter.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Emitter, (emitter) => emitter.car, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  emitter?: Emitter;

  @Column({ length: 17, unique: true })
  vin: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 50 })
  model: string;

  @Column()
  year: Date;

  @Column({ length: 50 })
  color: string;

  @Column({ name: 'photos_urls', type: 'varchar', array: true })
  photosUrls: string[];

  @Column()
  mileage: number;

  @Column({ name: 'engine_capacity' })
  engineCapacity: number;

  @Column({ name: 'fuel_capacity' })
  fuelCapacity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
