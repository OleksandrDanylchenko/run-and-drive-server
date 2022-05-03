import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AtToken } from '@auth/types';
import { Public } from '@common/decorators';
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
}
