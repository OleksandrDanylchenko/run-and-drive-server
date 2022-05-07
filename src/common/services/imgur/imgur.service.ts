import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ImgurClient } from 'imgur';
import { AlbumData, Payload as ImagePayload } from 'imgur/lib/common/types';

import { ImgurClientProvider } from '@common/services/imgur/constants';
import { ImgurEntityIds } from '@common/types';

export interface NewAlbumData extends AlbumData {
  deletehash: string;
}

@Injectable()
export class ImgurService {
  private logger = new Logger('ImgurService');

  constructor(
    @Inject(ImgurClientProvider)
    private imgurClient: ImgurClient,
  ) {}

  async getPhotoUrl(photoId: string): Promise<string | undefined> {
    try {
      const { data } = await this.imgurClient.getImage(photoId);
      return data.link;
    } catch (error) {
      return undefined;
    }
  }

  async uploadPhoto({
    photo,
    exitingPhotoHash,
  }: {
    photo: Express.Multer.File;
    exitingPhotoHash?: string;
  }): Promise<ImgurEntityIds> {
    if (exitingPhotoHash) {
      await this.imgurClient.deleteImage(exitingPhotoHash);
    }
    return this.uploadPhotoFile(photo);
  }

  private async uploadPhotoFile(
    photo: Express.Multer.File,
  ): Promise<ImgurEntityIds> {
    const { originalname, buffer } = photo;
    const imagePayload: ImagePayload = {
      title: originalname,
      image: buffer,
    };
    const { success, data } = await this.imgurClient.upload(imagePayload);
    if (!success) {
      throw new InternalServerErrorException(
        `Cannot create an image ${originalname}`,
      );
    }
    const { id, deletehash } = data;
    return { id, deletehash };
  }

  async getAlbumPhotosUrls(albumId: string): Promise<string[]> {
    try {
      const { data } = await this.imgurClient.getAlbum(albumId);
      return data.images.map(({ link }) => link);
    } catch (error) {
      return [];
    }
  }

  async uploadPhotosToAlbum({
    photos,
    albumTitle,
    existingAlbumHash,
  }: {
    photos: Array<Express.Multer.File>;
    albumTitle: string;
    existingAlbumHash?: string;
  }): Promise<ImgurEntityIds> {
    if (existingAlbumHash) {
      await this.deleteExistingAlbumPhotos(existingAlbumHash);
    }
    const albumIds = await this.createNewAlbum(albumTitle);
    await Promise.all(photos.map((photo) => this.uploadPhotoFile(photo)));
    return albumIds;
  }

  private async deleteExistingAlbumPhotos(albumHash: string) {
    try {
      await this.imgurClient.request({
        method: 'delete',
        url: `3/album/${albumHash}`,
      });
    } catch (error) {
      if (error.status !== 404) {
        this.logger.error('Error deleting the album', error);
      }
    }
  }

  private async createNewAlbum(title: string): Promise<ImgurEntityIds> {
    const { success, data } = await this.imgurClient.createAlbum(
      `${title}_photos`,
    );
    if (!success) {
      throw new InternalServerErrorException(
        `Cannot create an album with title ${title}`,
      );
    }
    const { id, deletehash } = data as NewAlbumData;
    return { id, deletehash };
  }
}
