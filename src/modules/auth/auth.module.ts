import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmExModule } from '@database/typeorm-ex.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './entities/user.repository';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    TypeOrmExModule.forCustomRepository([UsersRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
