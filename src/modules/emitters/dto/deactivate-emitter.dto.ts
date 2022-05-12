import { IsNotEmpty, IsString } from 'class-validator';

export class DeactivateEmitterDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
