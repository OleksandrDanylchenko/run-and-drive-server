import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { CreateTripDto } from '@trips/dto/create-trip.dto';
import { EndTripDto } from '@trips/dto/end-trip.dto';
import { FindAllFilterDto } from '@trips/dto/find-all-filter.dto';
import { GetTripDto } from '@trips/dto/get-trip.dto';
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

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterDto: FindAllFilterDto): Promise<GetTripDto[]> {
    return this.tripsService.findAll(filterDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) tripId: string,
  ): Promise<GetTripDto> {
    return this.tripsService.findOne(tripId);
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

  @Patch(':id/end')
  @HttpCode(HttpStatus.CREATED)
  async endTrip(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() dto: EndTripDto,
  ): Promise<ChangeResponseDto> {
    const { id } = await this.tripsService.endTrip(tripId, dto);
    return { id };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') tripId: string): Promise<boolean> {
    return this.tripsService.remove(tripId);
  }
}
