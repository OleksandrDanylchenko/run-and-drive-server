import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
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
}
