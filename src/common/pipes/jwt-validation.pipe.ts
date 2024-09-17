import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtValidationPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform(value: any) {
    try {
      const decoded = this.jwtService.decode(value);

      if (!decoded) {
        throw new BadRequestException('Invalid JWT token');
      }

      return value;
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException('Invalid JWT token');
    }
  }
}
