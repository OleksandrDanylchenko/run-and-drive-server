import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AtToken } from '@auth/types';
import { GetCurrentUserId, Public } from '@common/decorators';
import { GetActiveTripDto } from '@emitters/dto/get-active-trip.dto';
import { RegisterEmitterDto } from '@emitters/dto/register-emitter.dto';
import { EmittersService } from '@emitters/emitters.service';

@Controller('emitters')
export class EmittersController {
  constructor(private emittersService: EmittersService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: RegisterEmitterDto): Promise<AtToken> {
    return this.emittersService.register(dto);
  }

  @Post('unregister')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() emitterId: string): Promise<boolean> {
    return this.emittersService.unregister(emitterId);
  }
}
