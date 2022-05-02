import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@auth/entities/user.entity';

@Entity('engineers')
export class Engineer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'activation_login', length: 200, unique: true })
  activationLogin: string;

  @Column({ name: 'employee_number' })
  @Generated('increment')
  employeeNumber: number;

  @OneToOne(() => User, (user) => user.engineer, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id' }])
  user: User;
}
