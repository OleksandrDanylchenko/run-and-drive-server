import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
