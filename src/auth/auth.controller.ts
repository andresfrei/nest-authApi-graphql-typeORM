import { Controller, Post, Body, Param, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { JwtValidationPipe } from 'src/common/pipes/jwt-validation.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('recover-password')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto.email);
  }

  @Post('confirm/:token')
  @UsePipes(JwtValidationPipe)
  async confirmEmail(@Param('token') token: string) {
    return this.authService.confirmEmail(token);
  }
}
