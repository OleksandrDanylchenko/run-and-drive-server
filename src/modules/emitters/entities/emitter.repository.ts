import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';

import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { Emitter } from '@emitters/entities/emitter.entity';
import { Engineer } from '@engineers/entities/engineer.entity';
import { Trip } from '@trips/entities/trip.entity';

@CustomRepository(Emitter)
export class EmittersRepository extends Repository<Emitter> {
  async getEmitter(
    emitterId: string,
    relations?: FindOneOptions<Trip>['relations'],
  ) {
    const trip = await this.findOne({
      where: { id: emitterId },
      relations,
    });
    if (!trip) {
      throw new NotFoundException(`Emitter ${emitterId} cannot be found!`);
    }
    return trip;
  }

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
