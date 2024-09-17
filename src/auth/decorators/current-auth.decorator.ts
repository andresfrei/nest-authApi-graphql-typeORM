import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Auth } from '../entities/auth.entity';

export const CurrentAuth = createParamDecorator(
  (roles = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const auth: Auth = ctx.getContext().req.user;
    if (!auth)
      throw new InternalServerErrorException(
        'No user inside the request - make sure that we used the AuthGuard',
      );
    return auth;
  },
);
