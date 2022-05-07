import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CarsRepository } from '@cars/entities/car.repository';
import { ImgurService } from '@common/services/imgur/imgur.service';
import { ImgurAlbumIds } from '@common/types';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarsRepository)
    private carsRepository: CarsRepository,
    private imgurService: ImgurService,
  ) {}

  async create(dto: CreateCarDto): Promise<Car> {
    return this.carsRepository.createCar(dto);
  }

  async updatePhotos(
    carId: string,
    photos: Array<Express.Multer.File>,
  ): Promise<ImgurAlbumIds> {
    const car = await this.carsRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException(`Car ${carId} cannot be found!`);
    }

    const { album: albumIds } = car;
    const newAlbumIds = await this.imgurService.uploadPhotosToAlbum({
      photos,
      albumTitle: `${carId}_photos`,
      existingAlbumHash: albumIds?.deletehash,
    });
    await this.carsRepository.update({ id: carId }, { album: newAlbumIds });

    return newAlbumIds;
  }

  async delete(carId: string): Promise<boolean> {
    return this.carsRepository.deleteCar(carId);
  }
}
