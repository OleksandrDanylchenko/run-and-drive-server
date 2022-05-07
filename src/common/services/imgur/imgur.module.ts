import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImgurClient } from 'imgur';

export const ImgurClientProvider = Symbol('ImgurClientProvider');

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
  providers: [imgurClientFactory],
  exports: [ImgurClientProvider],
})
export class ImgurModule {}
