import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { Location } from '@common/dto/location.dto';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsNotEmpty()
  @ValidateNested()
  location: Location;
}
