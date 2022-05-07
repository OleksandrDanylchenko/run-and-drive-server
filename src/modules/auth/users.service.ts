import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImgurService } from '@common/services/imgur/imgur.service';
import { ImgurEntityIds } from '@common/types';

import { UsersRepository } from './entities/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private imgurService: ImgurService,
  ) {}

  async updatePhoto(
    userId: string,
    photo: Express.Multer.File,
  ): Promise<ImgurEntityIds> {
    const { photo: existingPhoto } = await this.usersRepository.getUser(userId);

    const newPhotoIds = await this.imgurService.uploadPhoto({
      photo,
      exitingPhotoHash: existingPhoto?.deletehash,
    });
    await this.usersRepository.update({ id: userId }, { photo: newPhotoIds });

    return newPhotoIds;
  }
}
