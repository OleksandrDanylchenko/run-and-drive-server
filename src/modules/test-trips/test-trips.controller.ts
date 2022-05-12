import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { GetTestTripSummaryDto } from '@test-trips/dto/get-test-trip-summary.dto';
import { GetTestTripDto } from '@test-trips/dto/get-test-trip.dto';
import { TestTripsService } from '@test-trips/test-trips.service';

@Controller('test-trips')
export class TestTripsController {
  constructor(private tripsService: TestTripsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<GetTestTripSummaryDto[]> {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) tripId: string,
  ): Promise<GetTestTripDto> {
    return this.tripsService.findOne(tripId);
  }
}
