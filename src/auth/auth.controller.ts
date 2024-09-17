import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  ConfirmEmailDto,
  LoginDto,
  RecoverPasswordDto,
  RegisterDto,
} from './dto';
import { AuthResponse } from './types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('recover-password')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto.email);
  }

  @Get('confirm')
  async confirmEmail(@Query() confirmEmailDto: ConfirmEmailDto) {
    const { token } = confirmEmailDto;
    return this.authService.confirmEmail(token);
  }
}
