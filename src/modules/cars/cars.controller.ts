import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CarsService } from '@cars/cars.service';
import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCarDto): Promise<Car> {
    return this.carsService.create(dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  logout(carId: string): Promise<boolean> {
    return this.carsService.delete(carId);
  }
}
