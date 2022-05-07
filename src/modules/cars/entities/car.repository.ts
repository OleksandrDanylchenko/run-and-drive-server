import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';
import { Repository } from 'typeorm';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';

@CustomRepository(Car)
export class CarsRepository extends Repository<Car> {
  async getCar(carId: string) {
    const car = this.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException(`Car ${carId} cannot be found!`);
    }
    return car;
  }

  async createCar(dto: CreateCarDto): Promise<Car> {
    const car = this.create(dto);
    try {
      return await this.save(car);
    } catch (error) {
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        throw new ConflictException('Car with provided VIN already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteCar(carId: string): Promise<boolean> {
    const car = await this.findOneBy({ id: carId });
    if (!car) return true;

    await this.softRemove([car]);
    return true;
  }
}
