import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AuthSigninDto } from './auth-signin.dto';

export class AuthSignupDto extends AuthSigninDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // https://gist.github.com/arielweinberger/18a29bfa17072444d45adaeeb8e92ddc
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

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
