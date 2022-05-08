import { CreateCarDto } from '@cars/dto/create-car.dto';

export class GetCarDto extends CreateCarDto {
  id: string;
  photosUrls: string[];
}
