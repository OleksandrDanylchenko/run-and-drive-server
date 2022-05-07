import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CarsService } from '@cars/cars.service';
import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { ImgurAlbumIds } from '@common/types';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCarDto): Promise<Car> {
    return this.carsService.create(dto);
  }

  @Patch('/:id/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  @HttpCode(HttpStatus.OK)
  async updateCarPhotos(
    @Param('id') carId: string,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ): Promise<ImgurAlbumIds> {
    return this.carsService.updatePhotos(carId, photos);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  logout(@Param('id') carId: string): Promise<boolean> {
    return this.carsService.delete(carId);
  }
}
