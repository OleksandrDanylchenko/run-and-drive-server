import { InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PostgresError } from 'pg-error-enum';
import { Repository } from 'typeorm';

import { CustomRepository } from '@database/typeorm-ex.decorator';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { Emitter } from '@emitters/entities/emitter.entity';
import { Engineer } from '@engineers/entities/engineer.entity';

@CustomRepository(Emitter)
export class EmittersRepository extends Repository<Emitter> {
  async registerEmitter(
    dto: RegisterEmitterDto,
    engineer: Engineer,
  ): Promise<Emitter> {
    const emitter = this.create({ engineer });
    return this.save(emitter);
  }
}
