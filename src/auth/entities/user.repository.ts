import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PostgresError } from 'pg-error-enum';
import { Repository } from 'typeorm';

import { AuthSignupDto } from '@auth/dto';
import { CustomRepository } from '@database/typeorm-ex.decorator';

import { User } from './user.entity';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authSignupDto: AuthSignupDto): Promise<User> {
    const { name, surname, email, password, phone } = authSignupDto;

    const hashedPassword = await argon.hash(password);

    const user = this.create({
      name,
      surname,
      email,
      password: hashedPassword,
      phone,
    });
    try {
      return this.save(user);
    } catch (error) {
      // Duplicate email
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
