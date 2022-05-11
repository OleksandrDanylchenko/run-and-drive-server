import { GetUserDto } from '@auth/dto/get-user.dto';

export class GetEngineerDto {
  employeeNumber: number;
  user: GetUserDto;
}
