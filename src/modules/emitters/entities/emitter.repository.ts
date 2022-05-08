import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { Emitter } from '@emitters/entities/emitter.entity';
import { Engineer } from '@engineers/entities/engineer.entity';

@CustomRepository(Emitter)
export class EmittersRepository extends Repository<Emitter> {
  async registerEmitter(
    dto: RegisterEmitterDto,
    engineer: Engineer,
    car: Car,
  ): Promise<Emitter> {
    const emitter = this.create({ engineer, car });
    return this.save(emitter);
  }

  async deleteEmitter(emitterId: string): Promise<boolean> {
    const emitter = await this.findOneBy({ id: emitterId });
    if (!emitter) return true;

    await this.softRemove([emitter]);
    return true;
  }
}
