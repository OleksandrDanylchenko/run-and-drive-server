import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CarsRepository } from '@cars/entities/car.repository';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarsRepository)
    private carsRepository: CarsRepository,
  ) {}

  async create(dto: CreateCarDto): Promise<Car> {
    return this.carsRepository.createCar(dto);
  }
}
