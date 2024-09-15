import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Entidad de usuario
import { UsersService } from './users.service'; // Servicio de usuarios
//import { UsersResolver } from './users.resolver'; // Resolver para GraphQL (si usas GraphQL)
//import { UsersController } from './users.controller'; // Controlador de usuarios (si usas REST API)

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Importar el repositorio de TypeORM para la entidad User
  ],
  //providers: [UsersService, UsersResolver], // El servicio de usuarios y el resolver de GraphQL (si lo usas)
  providers: [UsersService], // El servicio de usuarios y el resolver de GraphQL (si lo usas)
  //controllers: [UsersController], // Controlador REST de usuarios
  exports: [UsersService], // Exportar el servicio de usuarios para que pueda ser utilizado en otros módulos
})
export class UsersModule {}
