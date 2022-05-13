import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

import { AuthSigninDto, AuthSignupDto } from '@auth/dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { JwtPayload, Tokens } from '@auth/types';

import { UsersRepository } from './entities/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthSignupDto): Promise<AuthResponseDto> {
    const { id: userId, email } = await this.usersRepository.createUser(dto);
    const tokens = await this.getTokens(userId, email);
    await this.updateRtHash(userId, tokens.refreshToken);
    return {
      ...tokens,
      userId,
    };
  }

  async signinLocal(dto: AuthSigninDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOneBy({ email: dto.email });
    if (!user) throw new ForbiddenException('Access Denied');

    const { id: userId, email, password } = user;

    const passwordMatches = await argon.verify(password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userId, email);
    await this.updateRtHash(userId, tokens.refreshToken);

    return {
      ...tokens,
      userId,
    };
  }

  async logout(userId: number): Promise<boolean> {
    await this.usersRepository.update(userId, { refreshTokenHash: null });
    return true;
  }

  async refreshTokens(userId: string, rt: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon.verify(user.refreshTokenHash, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return {
      ...tokens,
      userId,
    };
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.usersRepository.update(userId, { refreshTokenHash: hash });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: userId, email: email };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
