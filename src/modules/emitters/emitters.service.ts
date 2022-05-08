import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { IsNull } from 'typeorm';

import { AtToken } from '@auth/types';
import { CarsRepository } from '@cars/entities/car.repository';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { EmittersRepository } from '@emitters/entities/emitter.repository';
import { EngineersRepository } from '@engineers/entities/engineer.repository';
import { Trip } from '@trips/entities/trip.entity';
import { TripsRepository } from '@trips/entities/trip.repository';

@Injectable()
export class EmittersService {
  constructor(
    @InjectRepository(EmittersRepository)
    private emittersRepository: EmittersRepository,
    @InjectRepository(EngineersRepository)
    private engineersRepository: EngineersRepository,
    @InjectRepository(TripsRepository)
    private tripsRepository: TripsRepository,
    @InjectRepository(CarsRepository)
    private carsRepository: CarsRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterEmitterDto): Promise<AtToken> {
    const { activationLogin, carActivationCode } = dto;

    const engineer = await this.engineersRepository.findOne({
      where: { activationLogin },
      relations: { user: true },
    });
    if (!engineer) {
      throw new ForbiddenException('Access Denied');
    }
    const passwordMatches = await argon.verify(
      engineer.user.password,
      dto.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const car = await this.carsRepository.findOne({
      where: {
        activationCode: carActivationCode,
        emitter: IsNull(),
      },
      loadRelationIds: true,
    });
    if (!car) {
      throw new ForbiddenException('Access Denied');
    }

    const { id } = await this.emittersRepository.registerEmitter(
      dto,
      engineer,
      car,
    );

    const { accessToken } = await this.getToken(id, activationLogin);
    return { accessToken };
  }

  async unregister(emitterId: string): Promise<boolean> {
    return this.emittersRepository.deleteEmitter(emitterId);
  }

  async getToken(emitterId: string, activationLogin: string): Promise<AtToken> {
    const jwtPayload = { sub: emitterId, activationLogin };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('JWT_SECRET'),
    });
    return { accessToken };
  }

  async getActiveTrip(emitterId: string): Promise<Trip | undefined> {
    const emitter = await this.emittersRepository.getEmitter(emitterId, {
      car: true,
    });
    if (!emitter) {
      throw new NotFoundException(`Emitter ${emitterId} cannot be found!`);
    }
    return this.tripsRepository.getActiveTripForCar(emitter.car.id);
  }
}
