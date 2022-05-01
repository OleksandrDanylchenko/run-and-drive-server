import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string;

  @Column()
  phone: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;
}
