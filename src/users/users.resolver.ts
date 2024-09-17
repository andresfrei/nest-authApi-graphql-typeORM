import { Resolver, Query } from '@nestjs/graphql';
//import { UseGuards } from '@nestjs/common';

//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthResponse } from 'src/auth/types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentAuth } from 'src/auth/decorators/current-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthService } from 'src/auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentAuth() auth: Auth): AuthResponse {
    return this.authService.revalidateToken(auth);
  }
}
