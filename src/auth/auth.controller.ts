import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @Post('recover-password')
  async recoverPassword(@Body('email') email: string) {
    return this.authService.recoverPassword(email);
  }
}
