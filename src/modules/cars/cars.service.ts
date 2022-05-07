import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImgurClient } from 'imgur';
import { AlbumData, Payload as ImagePayload } from 'imgur/lib/common/types';

import { CreateCarDto } from '@cars/dto/create-car.dto';
import { Car } from '@cars/entities/car.entity';
import { CarsRepository } from '@cars/entities/car.repository';
import { CarPhotosAlbum } from '@cars/types';
import { ImgurClientProvider } from '@common/services/imgur/imgur.module';

interface NewAlbumData extends AlbumData {
  deletehash: string;
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarsRepository)
    private carsRepository: CarsRepository,
    @Inject(ImgurClientProvider)
    private imgurClient: ImgurClient,
  ) {}

  async create(dto: CreateCarDto): Promise<Car> {
    return this.carsRepository.createCar(dto);
  }

  async updatePhotos(
    carId: string,
    photos: Array<Express.Multer.File>,
  ): Promise<CarPhotosAlbum> {
    const car = await this.carsRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException(`Car ${carId} cannot be found!`);
    }

    let album = car.album;
    if (album) {
      await this.deletePreviousCarAlbumPhotos(album.id);
    } else {
      album = await this.createNewCarAlbum(carId);
    }

    const imagesPayloads: ImagePayload[] = photos.map((photo) => ({
      title: photo.originalname,
      image: photo.buffer,
      album: album.deletehash,
    }));
    await Promise.all(
      imagesPayloads.map((payload) => this.imgurClient.upload(payload)),
    );

    await this.carsRepository.update({ id: carId }, { album });

    return album;
  }

  private async deletePreviousCarAlbumPhotos(albumId: string) {
    const { success, data } = await this.imgurClient.getAlbum(albumId);
    if (!success) return;

    debugger;

    const imagesHash = data.images.map(({ deletehash }) => deletehash);
    return Promise.all(
      imagesHash.map((id) => this.imgurClient.deleteImage(id)),
    );
  }

  private async createNewCarAlbum(carId: string): Promise<CarPhotosAlbum> {
    const { success, data } = await this.imgurClient.createAlbum(
      `${carId}_photos`,
    );
    if (!success) {
      throw new InternalServerErrorException(
        `Cannot create an album for the car ${carId}`,
      );
    }

    const { id, deletehash } = data as NewAlbumData;
    return {
      id,
      deletehash,
    };
  }

  async delete(carId: string): Promise<boolean> {
    return this.carsRepository.deleteCar(carId);
  }
}
