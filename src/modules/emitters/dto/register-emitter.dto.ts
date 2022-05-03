import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterEmitterDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  activationLogin: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
