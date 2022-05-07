import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ImgurEntityIds } from '@common/types';
import { Engineer } from '@engineers/entities/engineer.entity';

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
}
