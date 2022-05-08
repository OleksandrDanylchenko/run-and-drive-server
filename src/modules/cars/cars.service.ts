import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { GetCarDto } from '@cars/dto/get-car.dto';
import { UpdateCarDto } from '@cars/dto/update-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CarsRepository } from '@cars/entities/car.repository';
import { ImgurService } from '@common/services/imgur/imgur.service';
import { ImgurEntityIds } from '@common/types';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarsRepository)
    private carsRepository: CarsRepository,
    private imgurService: ImgurService,
  ) {}

  async get(carId: string): Promise<Car> {
    return this.carsRepository.getCar(carId);
  }

  async create(dto: CreateCarDto): Promise<Car> {
    return this.carsRepository.createCar(dto);
  }

  async findOne(carId: string): Promise<GetCarDto> {
    const { album, ...car } = await this.get(carId);
    const photosUrls = album?.id
      ? await this.imgurService.getAlbumPhotosUrls(album.id)
      : [];
    return {
      ...car,
      photosUrls,
    };
  }

  async update(carId: string, dto: UpdateCarDto): Promise<Car> {
    await this.carsRepository.update(carId, dto);
    return this.get(carId);
  }

  async updatePhotos(
    carId: string,
    photos: Array<Express.Multer.File>,
  ): Promise<ImgurEntityIds> {
    const { album } = await this.carsRepository.getCar(carId);

    const newAlbumIds = await this.imgurService.uploadPhotosToAlbum({
      photos,
      albumTitle: `${carId}_photos`,
      existingAlbumHash: album?.deletehash,
    });
    await this.carsRepository.update({ id: carId }, { album: newAlbumIds });

    return newAlbumIds;
  }

  async remove(carId: string): Promise<boolean> {
    return this.carsRepository.deleteCar(carId);
  }
}
