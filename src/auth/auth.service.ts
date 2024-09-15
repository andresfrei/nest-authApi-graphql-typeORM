import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user.id });
    const confirmationUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/confirm?token=${token}`;

    //await this.emailService.sendEmail(
    this.emailService.sendEmail(
      user.email,
      'Confirma tu registro',
      'confirmation',
      { name: user.email, url: confirmationUrl },
    );

    return { message: 'Usuario registrado. Verifica tu email para confirmar.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid crededntials');
    }

    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const token = this.jwtService.sign({ id: user.id });
    const resetUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/reset-password?token=${token}`;

    await this.emailService.sendEmail(
      user.email,
      'Recupera tu contraseña',
      'recover-password',
      { name: user.email, url: resetUrl },
    );

    return { message: 'Revisa tu correo para restablecer la contraseña.' };
  }

  async confirmEmail(token: string) {
    console.log({ token });
    const { id } = this.jwtService.verify(token);
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new Error('Token inválido');
    }

    user.isEmailConfirmed = true;
    return this.usersService.update(user.id, user);
  }
}
