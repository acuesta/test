import { Module } from '@nestjs/common';
import { AuthenticateUser } from '../application/authenticate-user';
import { ChangePassword } from '../application/change-password';
import { GetUserProfile } from '../application/get-user-profile';
import { ListUsers } from '../application/list-users';
import { RegisterUser } from '../application/register-user';
import {
  ACCESS_TOKEN_ISSUER,
  AccessTokenIssuer,
} from '../domain/user/access-token-issuer';
import { PASSWORD_HASHER, PasswordHasher } from '../domain/user/password-hasher';
import { USER_REPOSITORY, UserRepository } from '../domain/user/user.repository';
import { readTokenSecret, readTokenTtlSeconds } from './config';
import { AuthGuard } from './http/auth.guard';
import { AuthController } from './http/auth.controller';
import { UsersController } from './http/users.controller';
import { InMemoryUserRepository } from './persistence/in-memory-user.repository';
import { BcryptPasswordHasher } from './security/bcrypt-password-hasher';
import { HmacAccessTokenIssuer } from './security/hmac-access-token-issuer';

@Module({
  controllers: [AuthController, UsersController],
  providers: [
    AuthGuard,
    { provide: USER_REPOSITORY, useClass: InMemoryUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    {
      provide: ACCESS_TOKEN_ISSUER,
      useFactory: () => new HmacAccessTokenIssuer(readTokenSecret(), readTokenTtlSeconds()),
    },
    {
      provide: RegisterUser,
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
      useFactory: (users: UserRepository, passwords: PasswordHasher) =>
        new RegisterUser(users, passwords),
    },
    {
      provide: AuthenticateUser,
      inject: [USER_REPOSITORY, PASSWORD_HASHER, ACCESS_TOKEN_ISSUER],
      useFactory: (
        users: UserRepository,
        passwords: PasswordHasher,
        tokens: AccessTokenIssuer,
      ) => new AuthenticateUser(users, passwords, tokens),
    },
    {
      provide: ChangePassword,
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
      useFactory: (users: UserRepository, passwords: PasswordHasher) =>
        new ChangePassword(users, passwords),
    },
    {
      provide: GetUserProfile,
      inject: [USER_REPOSITORY],
      useFactory: (users: UserRepository) => new GetUserProfile(users),
    },
    {
      provide: ListUsers,
      inject: [USER_REPOSITORY],
      useFactory: (users: UserRepository) => new ListUsers(users),
    },
  ],
})
export class UserModule {}
