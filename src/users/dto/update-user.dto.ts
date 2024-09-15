import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsString()
  @MinLength(6)
  @Field(() => String, { nullable: true })
  password?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  firstName?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  lastName?: string;

  @IsUrl()
  @IsOptional()
  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}
