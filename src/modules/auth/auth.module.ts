import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from '@auth/users.controller';
import { UsersService } from '@auth/users.service';
import { ImgurModule } from '@common/services/imgur/imgur.module';
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
    ImgurModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, AtStrategy, RtStrategy],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
