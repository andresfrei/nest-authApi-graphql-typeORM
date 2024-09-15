import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { JwtValidationPipe } from './pipes/jwt-validation.pipe';

@Module({
  imports: [JwtModule],
  providers: [JwtValidationPipe],
  exports: [JwtValidationPipe],
})
export class CommonModule {}
