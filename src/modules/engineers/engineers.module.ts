import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { UsersRepository } from '@auth/entities/user.repository';
import { TypeOrmExModule } from '@database/typeorm-ex.module';

import { EngineersController } from './engineers.controller';
import { EngineersService } from './engineers.service';
import { EngineersRepository } from './entities/engineer.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmExModule.forCustomRepository([EngineersRepository, UsersRepository]),
  ],
  controllers: [EngineersController],
  providers: [EngineersService],
})
export class EngineersModule {}
