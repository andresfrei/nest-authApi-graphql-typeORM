import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { Auth } from './entities/auth.entity';
import { EmailService } from '../email/email.service';

import { AuthResponse, JwtPayload } from './types';
import { FindOptions } from './interfaces/find-options.interface';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private getJwtToken(jwtPayload: JwtPayload): string {
    const token = this.jwtService.sign(jwtPayload);
    console.log(token);
    return token;
  }

  async register(registerUserDto: RegisterDto) {
    const auth = this.authRepository.create(registerUserDto);

    try {
      await this.authRepository.save(auth);
      const token = this.jwtService.sign({ email: auth.email });
      const confirmationUrl = `${process.env.HOST}:${process.env.PORT}/api/auth/confirm?token=${token}`;

      this.emailService.sendEmail(
        auth.email,
        'Confirma tu registro',
        'confirmation',
        { name: auth.email, url: confirmationUrl },
      );

      return {
        message: 'Registered user. Please check your email to confirm.',
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findById(id: string, options?: FindOptions): Promise<Auth> {
    const auth = await this.authRepository.findOne({ where: { id } });
    if (!auth)
      throw new UnauthorizedException(
        options?.notFoundMessage || 'Auth id not found',
      );
    return auth;
  }

  async findByEmail(email: string, options?: FindOptions): Promise<Auth> {
    const auth: Auth = await this.authRepository.findOne({ where: { email } });
    if (!auth)
      throw new UnauthorizedException(
        options?.notFoundMessage || 'Email not found',
      );
    return auth;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const auth = await this.findByEmail(email, {
      notFoundMessage: 'Invalid credentials',
    });

    if (!compareSync(password, auth.password))
      throw new UnauthorizedException('Invalid credentials');

    if (!auth.isEmailConfirmed)
      throw new UnauthorizedException('Email not confirmed');

    const { id, shopId } = auth;

    const token = this.getJwtToken({ authId: id, shopId });

    return {
      token,
      user: { id, email, shopId },
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

  revalidateToken(currentAuth: Auth): AuthResponse {
    const { id, shopId, email } = currentAuth;
    const token = this.getJwtToken({ authId: id, shopId });
    return {
      token,
      user: { id, email, shopId },
    };
  }

  async validateAuth(id: string): Promise<Auth> {
    const auth = await this.findById(id);
    if (!auth.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');
    return auth;
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      throw new UnauthorizedException(error.detail);
    }

    throw new InternalServerErrorException(
      'Please check your server error log',
    );
  }
}
