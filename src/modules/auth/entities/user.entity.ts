import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { ImgurEntityIds } from '@common/types';
import { Engineer } from '@engineers/entities/engineer.entity';
import { Trip } from '@trips/entities/trip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  surname: string;

  @Column({ length: 200, unique: true })
  email: string;

  @Column({ length: 200 })
  password: string;

  @Column({ type: 'json', nullable: true })
  photo?: ImgurEntityIds;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'refresh_token_hash', length: 300, nullable: true })
  refreshTokenHash: string;

  @OneToOne(() => Engineer, (engineer) => engineer.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  engineer?: Engineer;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @RelationId((user: User) => user.trips)
  tripsIds: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
