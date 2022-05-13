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

import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { GetSensorsRecordDto } from '@sensors/dto/get-sensors-record.dto';
import { SensorsService } from '@sensors/sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Get('/trip/:id/last')
  @HttpCode(HttpStatus.OK)
  async findLastByTrip(
    @Param('id', ParseUUIDPipe) tripId: string,
  ): Promise<GetSensorsRecordDto | undefined> {
    return this.sensorsService.findLastByTrip(tripId);
  }

  @Get('/trip/:id')
  @HttpCode(HttpStatus.OK)
  async findAllByTrip(
    @Param('id', ParseUUIDPipe) tripId: string,
  ): Promise<GetSensorsRecordDto[] | undefined> {
    return this.sensorsService.findAllByTrip(tripId);
  }

  @Post('record')
  @HttpCode(HttpStatus.CREATED)
  async createRecord(
    @Body() dto: CreateSensorsRecordDto,
  ): Promise<ChangeResponseDto> {
    const { id } = await this.sensorsService.createRecord(dto);
    return { id };
  }
}
