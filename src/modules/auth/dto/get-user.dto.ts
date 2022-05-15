import { UpdateUserDto } from '@auth/dto/update-user.dto';

export class GetUserDto extends UpdateUserDto {
  photoUrl?: string;
  tripsIds: string[];
  createdAt: Date;
}
