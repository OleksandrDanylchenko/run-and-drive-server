import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUserDto } from '@auth/dto/get-user.dto';
import { UpdateUserDto } from '@auth/dto/update-user.dto';
import { UsersService } from '@auth/users.service';
import { ImgurEntityIds } from '@common/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  getUser(@Param('id', ParseUUIDPipe) userId: string): Promise<GetUserDto> {
    return this.usersService.findOne(userId);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<boolean> {
    await this.usersService.update(userId, dto);
    return true;
  }

  @Patch(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  @HttpCode(HttpStatus.OK)
  async updateUserPhoto(
    @Param('id', ParseUUIDPipe) userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<ImgurEntityIds> {
    return this.usersService.updatePhoto(userId, photo);
  }
}
