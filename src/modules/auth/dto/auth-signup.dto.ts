import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

import { AuthSigninDto } from './auth-signin.dto';

export class AuthSignupDto extends AuthSigninDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsPhoneNumber('UA')
  phone: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}
