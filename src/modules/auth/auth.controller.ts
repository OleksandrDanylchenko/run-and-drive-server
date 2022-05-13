import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthSigninDto, AuthSignupDto } from '@auth/dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import {
  GetCurrentUserData,
  GetCurrentUserId,
  Public,
} from '@common/decorators';
import { RtGuard } from '@common/guards';

import { AuthService } from './auth.service';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthSignupDto): Promise<AuthResponseDto> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthSigninDto): Promise<AuthResponseDto> {
    return this.authService.signinLocal(dto);
  }

  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUserData('refreshToken') refreshToken: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
