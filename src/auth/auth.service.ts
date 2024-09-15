import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService, // Inyectar el servicio de correo
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Generar el token JWT
    const token = this.jwtService.sign({ id: user.id });
    const confirmationUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/confirm?token=${token}`;

    // Enviar el email de confirmación
    await this.emailService.sendEmail(
      user.email,
      'Confirma tu registro',
      'confirmation', // Template a usar
      { name: user.email, url: confirmationUrl }, // Contexto para la plantilla
    );

    return { message: 'Usuario registrado. Verifica tu email para confirmar.' };
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const token = this.jwtService.sign({ id: user.id });
    const resetUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/reset-password?token=${token}`;

    // Enviar el email de recuperación de contraseña
    await this.emailService.sendEmail(
      user.email,
      'Recupera tu contraseña',
      'recover-password',
      { name: user.email, url: resetUrl },
    );

    return { message: 'Revisa tu correo para restablecer la contraseña.' };
  }
}
