import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/localhost:(3000|3100)/], // Local development addresses for the admin & emitter apps
  });

  await app.listen(3200);
}
bootstrap();
