import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { GetCurrentUserId, Public } from '@common/decorators';
import { DeactivateEmitterDto } from '@emitters/dto/deactivate-emitter.dto';
import {
  RegisterEmitterDto,
  RegisterEmitterResponseDto,
} from '@emitters/dto/register-emitter.dto';
import { EmittersService } from '@emitters/emitters.service';
import { GetTripDto } from '@trips/dto/get-trip.dto';

@Controller('emitters')
export class EmittersController {
  constructor(private emittersService: EmittersService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(
    @Body() dto: RegisterEmitterDto,
  ): Promise<RegisterEmitterResponseDto> {
    return this.emittersService.register(dto);
  }

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() emitterId: string,
    @Body() dto: DeactivateEmitterDto,
  ): Promise<boolean> {
    return this.emittersService.deactivate(emitterId, dto);
  }

  @Get('active-trip')
  @HttpCode(HttpStatus.OK)
  async getActiveTrip(
    @GetCurrentUserId() emitterId: string,
  ): Promise<GetTripDto> {
    return this.emittersService.getActiveTrip(emitterId);
  }
}
