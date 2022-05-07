import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

import { AtToken } from '@auth/types';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { EmittersRepository } from '@emitters/entities/emitter.repository';
import { EngineersRepository } from '@engineers/entities/engineer.repository';

@Injectable()
export class EmittersService {
  constructor(
    @InjectRepository(EmittersRepository)
    private emittersRepository: EmittersRepository,
    @InjectRepository(EngineersRepository)
    private readonly engineersRepository: EngineersRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterEmitterDto): Promise<AtToken> {
    const { activationLogin } = dto;

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

    const { id } = await this.emittersRepository.registerEmitter(dto, engineer);

    const { accessToken } = await this.getToken(id, activationLogin);
    return { accessToken };
  }

  async unregister(emitterId: string): Promise<boolean> {
    const emitter = await this.emittersRepository.findOneBy({ id: emitterId });
    if (!emitter) return true;

    await this.emittersRepository.softRemove([emitter]);
    return true;
  }

  async getToken(emitterId: string, activationLogin: string): Promise<AtToken> {
    const jwtPayload = { sub: emitterId, activationLogin };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('JWT_SECRET'),
    });
    return { accessToken };
  }
}
