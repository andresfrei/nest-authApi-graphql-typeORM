import { compareSync } from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';
import { EmailService } from '../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerUserDto: RegisterDto) {
    const auth = this.authRepository.create(registerUserDto);

    await this.authRepository.save(auth);

    const token = this.jwtService.sign({ email: auth.email });
    const confirmationUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/confirm?token=${token}`;

    this.emailService.sendEmail(
      auth.email,
      'Confirma tu registro',
      'confirmation',
      { name: auth.email, url: confirmationUrl },
    );

    return { message: 'Registered user. Please check your email to confirm.' };
  }

  async findById(id: string): Promise<Auth> {
    const auth = await this.authRepository.findOne({ where: { id } });
    if (!auth) throw new UnauthorizedException('User not found');
    return auth;
  }

  async findByEmail(email: string): Promise<Auth> {
    const auth: Auth = await this.authRepository.findOne({ where: { email } });
    if (!auth) throw new UnauthorizedException('Email no register');
    return auth;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const auth = await this.findByEmail(email);
    console.log({ auth, password });

    if (!compareSync(password, auth.password))
      throw new UnauthorizedException('Invalid credentials');

    if (!auth.isEmailConfirmed)
      throw new UnauthorizedException('Email not confirmed');

    const payload = { id: auth.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async recoverPassword(email: string) {
    const auth = await this.findByEmail(email);

    const token = this.jwtService.sign({ id: auth.id });
    const resetUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/reset-password?token=${token}`;

    this.emailService.sendEmail(
      auth.email,
      'Recupera tu contraseña',
      'recover-password',
      { name: auth.email, url: resetUrl },
    );

    return { message: 'Check your email to reset your password.' };
  }

  async confirmEmail(token: string) {
    const { email } = this.jwtService.verify(token);
    const auth = await this.findByEmail(email);

    if (auth.isEmailConfirmed)
      throw new BadRequestException('Email already confirmed');

    auth.isEmailConfirmed = true;
    await this.authRepository.save(auth);
    return { message: `Email ${auth.email} confirmed successfully.` };
  }
}
