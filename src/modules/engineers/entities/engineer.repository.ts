import { InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PostgresError } from 'pg-error-enum';
import { Repository } from 'typeorm';

import { User } from '@auth/entities/user.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { Engineer } from '@engineers/entities/engineer.entity';

@CustomRepository(Engineer)
export class EngineersRepository extends Repository<Engineer> {
  async createEngineer(user: User): Promise<Engineer> {
    const engineer = this.create({
      user,
      activationLogin: nanoid(8),
    });

    try {
      return await this.save(engineer);
    } catch (error) {
      // Try to create an engineer till the `activationLogin` will be unique
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        return this.createEngineer(user);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
