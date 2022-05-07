import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUserDto } from '@auth/dto/get-user.dto';
import { UsersService } from '@auth/users.service';
import { ImgurEntityIds } from '@common/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  getCar(@Param('id') userId: string): Promise<GetUserDto> {
    return this.usersService.get(userId);
  }

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
