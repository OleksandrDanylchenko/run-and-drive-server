import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { UpdateTripStageDto } from '@trips/dto/update-trip-stage.dto';
import { TripsService } from '@trips/trips.service';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTripDto): Promise<ChangeResponseDto> {
    const { id } = await this.tripsService.create(dto);
    return { id };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateStage(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() dto: UpdateTripStageDto,
  ): Promise<ChangeResponseDto> {
    const { id } = await this.tripsService.updateStage(tripId, dto);
    return { id };
  }
}
