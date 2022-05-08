import { ValidateNested } from 'class-validator';

import { Location } from '@common/dto/location.dto';

export class EndTripDto {
  @ValidateNested()
  location?: Location;
}
