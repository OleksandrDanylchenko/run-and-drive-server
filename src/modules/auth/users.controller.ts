import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from '@auth/users.service';
import { ImgurEntityIds } from '@common/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @HttpCode(HttpStatus.OK)
  async updateUserPhoto(
    @Param('id') userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<ImgurEntityIds> {
    return this.usersService.updatePhoto(userId, photo);
  }
}
