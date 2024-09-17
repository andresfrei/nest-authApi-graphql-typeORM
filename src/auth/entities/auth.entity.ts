import { Field, ID, ObjectType } from '@nestjs/graphql';
import { hashSync } from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('authentication')
@ObjectType()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field(() => String)
  shopId: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  // Método para hash de la contraseña antes de guardar en la base de datos
  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
