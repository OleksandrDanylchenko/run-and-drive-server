import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { AuthSignupDto } from '@auth/dto';
import { GetEngineerDto } from '@engineers/dto/get-engineer.dto';

import { CreateEngineerResponseDto } from './dto/create-engineer-response.dto';
import { EngineersService } from './engineers.service';

@Controller('engineers')
export class EngineersController {
  constructor(private engineersService: EngineersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  getEngineer(
    @Param('id', ParseUUIDPipe) engineerId: string,
  ): Promise<GetEngineerDto> {
    return this.engineersService.findOne(engineerId);
  }

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
