import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule], // Para leer las variables de entorno
  providers: [EmailService], // El servicio de envío de correos
  exports: [EmailService], // Exportamos el servicio para usarlo en otros módulos
})
export class EmailModule {}
