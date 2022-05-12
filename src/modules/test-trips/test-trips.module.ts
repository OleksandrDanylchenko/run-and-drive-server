import { Module } from '@nestjs/common';

import { TestTripsController } from '@test-trips/test-trips.controller';
import { TestTripsService } from '@test-trips/test-trips.service';

@Module({
  imports: [],
  controllers: [TestTripsController],
  providers: [TestTripsService],
})
export class TestTripsModule {}
