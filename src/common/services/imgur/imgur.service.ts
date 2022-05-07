import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ImgurClient } from 'imgur';
import { AlbumData, Payload as ImagePayload } from 'imgur/lib/common/types';

import { ImgurClientProvider } from '@common/services/imgur/constants';
import { ImgurAlbumIds } from '@common/types';

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
  }): Promise<ImgurAlbumIds> {
    if (existingAlbumHash) {
      await this.deleteExistingAlbumPhotos(existingAlbumHash);
    }
    const albumIds = await this.createNewAlbum(albumTitle);

    const imagesPayloads: ImagePayload[] = photos.map((photo) => ({
      title: photo.originalname,
      image: photo.buffer,
      album: albumIds.deletehash,
    }));
    await Promise.all(
      imagesPayloads.map((payload) => this.imgurClient.upload(payload)),
    );

    return albumIds;
  }

  private async deleteExistingAlbumPhotos(albumHash: string) {
    try {
      await this.imgurClient.request({
        method: 'delete',
        url: `3/album/${albumHash}`,
      });
    } catch (error) {
      debugger;
      if (error.status !== 404) {
        this.logger.error('Error deleting the album', error);
      }
    }
  }

  private async createNewAlbum(title: string): Promise<ImgurAlbumIds> {
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
