import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configValidationSchema } from '@config/config.schema';
import { PostgresDatabaseModule } from '@database/pg.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    PostgresDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
