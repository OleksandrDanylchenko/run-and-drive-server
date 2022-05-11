import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';
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
    try {
      return await this.save(emitter);
    } catch (error) {
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        throw new ConflictException('Car already has emitter assigned');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteEmitter(emitterId: string): Promise<boolean> {
    const emitter = await this.findOneBy({ id: emitterId });
    if (!emitter) return true;

    await this.softRemove([emitter]);
    return true;
  }
}
