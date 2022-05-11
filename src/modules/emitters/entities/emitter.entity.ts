import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { Engineer } from '@engineers/entities/engineer.entity';

@Entity('emitters')
export class Emitter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Engineer, (engineer) => engineer.emitters, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'engineer_id' }])
  engineer?: Engineer;

  @OneToOne(() => Car, (car) => car.emitter, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'car_id' }])
  @Index({ unique: true, where: 'emitters.deactivated_at IS NULL' })
  car: Car;

  @CreateDateColumn({ name: 'activated_at' })
  activatedAt: Date;

  @DeleteDateColumn({ name: 'deactivated_at' })
  deactivatedAt?: Date;
}
