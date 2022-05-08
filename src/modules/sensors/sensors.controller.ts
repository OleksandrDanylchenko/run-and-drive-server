import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { CreateSensorsRecordDto } from '@sensors/dto/create-record.dto';
import { SensorsService } from '@sensors/sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Post('/record')
  @HttpCode(HttpStatus.CREATED)
  async createRecord(
    @Body() dto: CreateSensorsRecordDto,
  ): Promise<ChangeResponseDto> {
    const { id } = await this.sensorsService.createRecord(dto);
    return { id };
  }
}
