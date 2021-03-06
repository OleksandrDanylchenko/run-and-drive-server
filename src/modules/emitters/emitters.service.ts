import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

import { AtToken } from '@auth/types';
import { CarsRepository } from '@cars/entities/car.repository';
import { DeactivateEmitterDto } from '@emitters/dto/deactivate-emitter.dto';
import {
  RegisterEmitterDto,
  RegisterEmitterResponseDto,
} from '@emitters/dto/register-emitter.dto';
import { EmittersRepository } from '@emitters/entities/emitter.repository';
import { EngineersRepository } from '@engineers/entities/engineer.repository';
import { GetTripDto } from '@trips/dto/get-trip.dto';
import { TripsRepository } from '@trips/entities/trip.repository';
import { TripsService } from '@trips/trips.service';

@Injectable()
export class EmittersService {
  private logger = new Logger('EmittersService');

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
    private tripsService: TripsService,
  ) {}

  async register(dto: RegisterEmitterDto): Promise<RegisterEmitterResponseDto> {
    const { activationLogin, carActivationCode } = dto;

    const engineer = await this.engineersRepository.findOne({
      where: { activationLogin },
      relations: { user: true },
    });
    if (!engineer) {
      this.logger.error(`Engineer not found for login: ${activationLogin}`);
      throw new ForbiddenException('Access Denied');
    }
    const passwordMatches = await argon.verify(
      engineer.user.password,
      dto.password,
    );
    if (!passwordMatches) {
      this.logger.error(
        `Passwords not match for the engineer: ${activationLogin}`,
      );
      throw new ForbiddenException('Access Denied');
    }

    const car = await this.carsRepository.findOne({
      where: {
        activationCode: carActivationCode,
      },
      relations: {
        emitter: true,
      },
    });
    if (!car) {
      this.logger.error(`No car found by code: ${carActivationCode}`);
      throw new ForbiddenException('Access Denied');
    }

    const { id, activatedAt } = await this.emittersRepository.registerEmitter(
      dto,
      engineer,
      car,
    );

    const { accessToken } = await this.getToken(id, activationLogin);
    return {
      accessToken,
      emitterId: id,
      carId: car.id,
      engineerId: engineer.id,
      activatedAt,
    };
  }

  async deactivate(
    emitterId: string,
    dto: DeactivateEmitterDto,
  ): Promise<boolean> {
    const emitter = await this.emittersRepository.getEmitter(emitterId, {
      engineer: true,
    });
    const engineer = await this.engineersRepository.findOne({
      where: { id: emitter.engineer.id },
      relations: { user: true },
    });
    const passwordMatches = await argon.verify(
      engineer.user.password,
      dto.password,
    );
    if (!passwordMatches) {
      this.logger.error(`Passwords not match for the engineer to deactivate!`);
      throw new ForbiddenException('Access Denied');
    }
    return this.emittersRepository.deleteEmitter(emitterId);
  }

  async getToken(emitterId: string, activationLogin: string): Promise<AtToken> {
    const jwtPayload = { sub: emitterId, activationLogin };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('JWT_SECRET'),
    });
    return { accessToken };
  }

  async getActiveTrip(emitterId: string): Promise<GetTripDto | undefined> {
    const emitter = await this.emittersRepository.getEmitter(emitterId, {
      car: true,
    });
    const trip = await this.tripsRepository.getActiveTripForCar(emitter.car.id);
    if (!trip) return;

    return this.tripsService.createTripDto(trip);
  }
}
