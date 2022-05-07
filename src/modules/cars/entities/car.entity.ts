import { Exclude } from 'class-transformer';
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
  @Exclude({ toPlainOnly: true })
  emitter?: Emitter;

  @Column({ length: 17, unique: true })
  vin: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 50 })
  model: string;

  @Column()
  year: number;

  @Column({ length: 50 })
  color: string;

  @Column({ name: 'album_hash', unique: true, nullable: true })
  albumHash?: string;

  @Column()
  mileage: number;

  @Column({ name: 'engine_capacity', type: 'decimal', precision: 2, scale: 1 })
  engineCapacity: number;

  @Column({ name: 'fuel_capacity' })
  fuelCapacity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
