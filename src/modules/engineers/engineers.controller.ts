import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthSignupDto } from '@auth/dto';

import { CreateEngineerResponseDto } from './dto/create-engineer-response.dto';
import { EngineersService } from './engineers.service';

@Controller('engineers')
export class EngineersController {
  constructor(private engineersService: EngineersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: AuthSignupDto,
  ): Promise<CreateEngineerResponseDto> {
    const { user: _user, ...createEngineerResponse } =
      await this.engineersService.create(dto);
    return createEngineerResponse;
  }
}
