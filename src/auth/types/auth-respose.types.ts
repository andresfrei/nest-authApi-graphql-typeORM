import { Field, ObjectType } from '@nestjs/graphql';
import { AuthData } from './auth-data.types';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;
  @Field(() => AuthData)
  user: AuthData;
}
