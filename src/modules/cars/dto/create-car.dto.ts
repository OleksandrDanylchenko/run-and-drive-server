import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  @Length(17, 17)
  vin: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  model: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  color: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  mileage: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  engineCapacity: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  fuelCapacity: number;
}
