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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CarsService } from '@cars/cars.service';
import { CreateCarDto } from '@cars/dto/create-car.dto';
import { GetCarDto } from '@cars/dto/get-car.dto';
import { UpdateCarDto } from '@cars/dto/update-car.dto';
import { ChangeResponseDto } from '@common/dto/change-response.dto';
import { ImgurEntityIds } from '@common/types';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCarDto): Promise<ChangeResponseDto> {
    const { id } = await this.carsService.create(dto);
    return { id };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) carId: string): Promise<GetCarDto> {
    return this.carsService.findOne(carId);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) carId: string,
    @Body() dto: UpdateCarDto,
  ): Promise<ChangeResponseDto> {
    const { id } = await this.carsService.update(carId, dto);
    return { id };
  }

  @Patch(':id/photos')
  @UseInterceptors(FilesInterceptor('photos'))
  @HttpCode(HttpStatus.OK)
  async updatePhotos(
    @Param('id', ParseUUIDPipe) carId: string,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ): Promise<ImgurEntityIds> {
    return this.carsService.updatePhotos(carId, photos);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') carId: string): Promise<boolean> {
    return this.carsService.remove(carId);
  }
}
