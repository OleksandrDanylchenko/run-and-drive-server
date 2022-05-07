import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/localhost:(3000|3100)/], // Local development addresses for the admin & emitter apps
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`Application is in the "${process.env.STAGE}" stage`);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
