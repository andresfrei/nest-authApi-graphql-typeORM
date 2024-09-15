import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      // Si el DTO contiene un nuevo password, lo encriptamos.
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id); // Retornar el usuario actualizado.
  }

  async confirmEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isEmailConfirmed = true;
    return await this.userRepository.save(user);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null; // Devolver null si las credenciales no son válidas.
  }
}
