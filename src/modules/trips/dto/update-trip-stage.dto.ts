import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { Location } from '@common/dto/location.dto';
import { TripStages } from '@trips/entities/trip.entity';

/**
 * We can separately patch the start and the end of the trip
 */
export class UpdateTripStageDto {
  @IsNotEmpty()
  @IsEnum(TripStages)
  stage: TripStages;

  @IsOptional()
  @ValidateNested()
  location?: Location;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  time?: Date;
}
