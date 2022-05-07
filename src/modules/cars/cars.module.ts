import { Module } from '@nestjs/common';

import { CarsController } from '@cars/cars.controller';
import { CarsService } from '@cars/cars.service';
import { CarsRepository } from '@cars/entities/car.repository';
import { ImgurModule } from '@common/services/imgur/imgur.module';
import { TypeOrmExModule } from '@database/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CarsRepository]), ImgurModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
