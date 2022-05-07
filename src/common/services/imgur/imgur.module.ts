import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImgurClient } from 'imgur';

import { ImgurClientProvider } from '@common/services/imgur/constants';
import { ImgurService } from '@common/services/imgur/imgur.service';

const imgurClientFactory = {
  provide: ImgurClientProvider,
  useFactory: (configService: ConfigService) => {
    const clientId = configService.get<string>('IMGUR_CLIENT_ID');
    return new ImgurClient({ clientId });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [ImgurService, imgurClientFactory],
  exports: [ImgurService],
})
export class ImgurModule {}
