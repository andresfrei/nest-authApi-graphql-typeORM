import { Resolver, Query } from '@nestjs/graphql';
//import { UseGuards } from '@nestjs/common';

//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { JwtPayload } from 'src/auth/types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
//import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => JwtPayload, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(): JwtPayload {
    //return this.authService.revalidateToken(user);
    throw new Error('Method not implemented.');
  }
}
