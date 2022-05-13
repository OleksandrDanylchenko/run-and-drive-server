import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Location } from '@common/dto/location.dto';
import { WheelsPressure } from '@sensors/entities/sensors-record.entity';

class WheelsPressureDto implements WheelsPressure {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  frontLeft: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  frontRight: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  rearLeft: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  rearRight: number;
}

export class CreateSensorsRecordDto {
  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsNotEmpty()
  @ValidateNested()
  location: Location;

  @IsNotEmpty()
  @Type(() => Number)
  fuelTankOccupancy: number;

  @IsOptional()
  @ValidateNested()
  wheelsPressure?: WheelsPressureDto;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  timestamp: Date;
}
