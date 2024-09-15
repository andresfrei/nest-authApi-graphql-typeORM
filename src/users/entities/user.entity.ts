import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // Decorador de GraphQL para definir la clase como un tipo de objeto
@Entity() // Decorador de TypeORM para definir la clase como una entidad de base de datos
export class User {
  @Field(() => String) // Decorador de GraphQL para exponer el campo como tipo String
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column()
  password: string; // No exponer en GraphQL
}
