import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthData {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  shopId?: string;
}
