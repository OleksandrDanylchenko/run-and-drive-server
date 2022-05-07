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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CarsService } from '@cars/cars.service';
import { CreateCarDto } from '@cars/dto/create-car.dto';
import { GetCarDto } from '@cars/dto/get-car.dto';
import { ImgurEntityIds } from '@common/types';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  getCar(@Param('id', ParseUUIDPipe) carId: string): Promise<GetCarDto> {
    return this.carsService.getDto(carId);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createCar(@Body() dto: CreateCarDto): Promise<boolean> {
    await this.carsService.create(dto);
    return true;
  }

  @Patch(':id/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  @HttpCode(HttpStatus.OK)
  async updateCarPhotos(
    @Param('id', ParseUUIDPipe) carId: string,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ): Promise<ImgurEntityIds> {
    return this.carsService.updatePhotos(carId, photos);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteCar(@Param('id') carId: string): Promise<boolean> {
    return this.carsService.delete(carId);
  }
}
