import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType() // Decorador de GraphQL para definir este DTO como un Input Type
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Field(() => String, { nullable: true }) // Campo opcional en GraphQL
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @Field(() => String, { nullable: true }) // Campo opcional en GraphQL
  password?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true }) // Campo opcional en GraphQL
  firstName?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true }) // Campo opcional en GraphQL
  lastName?: string;
}
