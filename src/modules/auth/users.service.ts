import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUserDto } from '@auth/dto/get-user.dto';
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

  async get(userId: string): Promise<GetUserDto> {
    const {
      photo,
      password: _p,
      refreshTokenHash: _rt,
      engineer: _e,
      ...user
    } = await this.usersRepository.getUser(userId);

    const photoUrl = await this.imgurService.getPhotoUrl(photo.id);
    return {
      ...user,
      photoUrl,
    };
  }

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
