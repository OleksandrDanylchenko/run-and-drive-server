import { Repository } from 'typeorm';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CustomRepository } from '@database/typeorm-ex.decorator';

@CustomRepository(Car)
export class CarsRepository extends Repository<Car> {
  async createCar(dto: CreateCarDto): Promise<Car> {
    const car = this.create(dto);
    return this.save(car);
  }
}
