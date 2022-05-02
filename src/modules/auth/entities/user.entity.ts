import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'photo_url', length: 300, nullable: true })
  photoUrl?: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'refresh_token_hash', length: 300, nullable: true })
  refreshTokenHash: string;
}
