# Nest Auth Base

Este proyecto es una implementación **base** para la autenticación en **NestJS** utilizando **API REST** para la autenticación y **GraphQL** para el resto de las funcionalidades. Incluye autenticación con **JWT**, confirmación de email, y validación de usuarios con **TypeORM** y **PostgreSQL**.

## Características

- **Autenticación con JWT** en **API REST**.
- **Confirmación de email** con **Nodemailer** y validación del token.
- **Recuperación de contraseña**.
- **TypeORM** con soporte para **UUID** en IDs de usuarios.
- **GraphQL** para gestionar datos adicionales de usuarios.
- Módulo **Common** para centralizar validaciones compartidas.
- Validación de **JWT** en parámetros de consulta.

## Tecnologías Utilizadas

- [NestJS](https://nestjs.com/) - Framework backend de Node.js
- [GraphQL](https://graphql.org/) - Para gestionar queries y mutations
- [TypeORM](https://typeorm.io/) - ORM para base de datos PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional
- [JWT](https://jwt.io/) - Autenticación basada en tokens
- [Nodemailer](https://nodemailer.com/about/) - Envío de correos electrónicos
- [Class-validator](https://github.com/typestack/class-validator) - Validación de datos

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/andresfrei/nestjs-auth-base
cd nest-auth-base
yarn install
```

## Variables de entorno

```bash
HOST=http://localhost
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=mydb

JWT_SECRET=mysecretkey
JWT_EXPIRE=1d

EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Levantar la base de datos con Docker

Para levantar la base de datos PostgreSQL en modo desarrollo, utiliza Docker Compose. El archivo docker-compose.yml ya está configurado para crear una instancia de PostgreSQL.

```bash
docker compose up -d
```

Esto levantará una base de datos PostgreSQL en el puerto 5432. Las credenciales de la base de datos deben coincidir con las que configuraste en el archivo `.env`.

## Ejecutar el proyecto

Una vez que la base de datos esté en funcionamiento, puedes ejecutar el servidor en modo desarrollo:

```bash
yarn start:dev
```

La API REST estará disponible en http://localhost:3000/api, y el Playground de GraphQL estará disponible en http://localhost:3000/graphql.

## Endpoints de API REST

- **POST** `/api/auth/register`: Registro de usuario con email y contraseña.
- **POST** `/api/auth/login`: Login de usuario con JWT.
- **POST** `/api/auth/recover-password`: Envío de email para recuperación de contraseña.
- **GET** `/api/auth/confirm?token=...`: Confirmación de email.

## GraphQL

Las demás operaciones, como la actualización de datos de usuario, se manejan a través de GraphQL con las resoluciones protegidas por autenticación.

### Ejemplo de una query para obtener los datos del usuario autenticado:

```graphql
query {
  me {
    id
    email
    isEmailConfirmed
  }
}
```

### Ejemplo de una mutation para actualizar el email del usuario:

```graphql
mutation {
  updateUser(updateUserInput: { email: "newemail@example.com" }) {
    id
    email
  }
}
```

### Estructura del Proyecto

```bash
src/
  auth/
    auth.controller.ts      # Controlador para la autenticación (API REST)
    auth.module.ts          # Módulo de autenticación
    auth.service.ts         # Lógica de autenticación (registro, login, confirmación)
    dto/                    # DTOs de autenticación (p.ej., RegisterDto, ConfirmEmailDto)
    jwt.strategy.ts         # Estrategia JWT para validación de tokens
  common/
    common.module.ts        # Módulo común para componentes compartidos
    pipes/                  # Pipes compartidos (p.ej., JwtValidationPipe)
  email/
    email.module.ts         # Módulo de envío de correos
    email.service.ts        # Servicio para envío de correos con plantillas
    templates/              # Plantillas de email
  users/
    entities/               # Entidades de usuario (p.ej., User)
    dto/                    # DTOs de usuario (p.ej., UpdateUserDto)
    users.module.ts         # Módulo de usuarios
    users.service.ts        # Lógica relacionada con usuarios
    users.resolver.ts       # Resolver GraphQL para usuarios
  main.ts                   # Archivo principal de la aplicación
```

### Próximos pasos

- Añadir más resoluciones en GraphQL para gestionar perfiles de usuario.
- Implementar tests para los módulos principales.
