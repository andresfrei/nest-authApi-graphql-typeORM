import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtPayload {
  @Field(() => String)
  authId: string;

  @Field(() => String)
  shopId: string;
}
