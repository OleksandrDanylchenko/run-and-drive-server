import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmExModule } from '@/database/typeorm-ex.module';
import { AuthModule } from '@auth/auth.module';
import { EmittersController } from '@emitters/emitters.controller';
import { EmittersService } from '@emitters/emitters.service';
import { EmittersRepository } from '@emitters/entities/emitter.repository';
import { EngineersRepository } from '@engineers/entities/engineer.repository';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    JwtModule.register({}),
    TypeOrmExModule.forCustomRepository([
      EmittersRepository,
      EngineersRepository,
    ]),
  ],
  controllers: [EmittersController],
  providers: [EmittersService],
})
export class EmittersModule {}
