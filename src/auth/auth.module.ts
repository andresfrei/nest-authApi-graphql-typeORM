import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule, // Importar el UsersModule para acceder a UsersService
    EmailModule, // Módulo para enviar correos electrónicos
    PassportModule.register({ defaultStrategy: 'jwt' }), // Integración con Passport y estrategia JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Leer la clave secreta desde las variables de entorno
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE') }, // Configuración de expiración del token
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // Proveedor del servicio de autenticación y estrategia JWT
  controllers: [AuthController], // Controlador de autenticación para las rutas REST
  exports: [AuthService], // Exportar el AuthService para que pueda ser usado en otros módulos si es necesario
})
export class AuthModule {}
