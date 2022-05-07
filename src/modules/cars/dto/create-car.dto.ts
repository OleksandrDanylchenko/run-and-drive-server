import {
  IsDate,
  IsInt,
  IsNotEmpty,
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
  @IsDate()
  year: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  color: string;

  @IsNotEmpty()
  @IsInt()
  mileage: number;

  @IsNotEmpty()
  @IsInt()
  engineCapacity: number;

  @IsNotEmpty()
  @IsInt()
  fuelCapacity: number;
}
