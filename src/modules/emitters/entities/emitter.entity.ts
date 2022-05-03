import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'activated_at' })
  activatedAt: Date;

  @DeleteDateColumn({ name: 'deactivated_at' })
  deactivatedAt?: Date;
}
