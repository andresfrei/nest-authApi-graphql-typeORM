import { hashSync } from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('authentication')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  // Método para hash de la contraseña antes de guardar en la base de datos
  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
