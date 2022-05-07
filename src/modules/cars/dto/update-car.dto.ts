import { IsOptional } from 'class-validator';

import { CreateCarDto } from '@cars/dto/create-car.dto';

export class UpdateCarDto extends CreateCarDto {
  @IsOptional()
  vin: string;

  @IsOptional()
  brand: string;

  @IsOptional()
  model: string;

  @IsOptional()
  year: number;

  @IsOptional()
  color: string;

  @IsOptional()
  mileage: number;

  @IsOptional()
  engineCapacity: number;

  @IsOptional()
  fuelCapacity: number;
}
