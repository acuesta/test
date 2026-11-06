import { randomUUID } from 'node:crypto';
import { Email } from '../domain/user/email';
import { PasswordHasher } from '../domain/user/password-hasher';
import { assertPasswordPolicy } from '../domain/user/password-policy';
import { User } from '../domain/user/user';
import { EmailAlreadyUsed } from '../domain/user/user.errors';
import { UserRepository } from '../domain/user/user.repository';
import { toUserView, UserView } from './user-view';

export interface RegisterUserInput {
  email: string;
  password: string;
  displayName: string;
}

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<UserView> {
    const email = Email.create(input.email);
    assertPasswordPolicy(input.password);

    const existing = await this.users.findByEmail(email.value);
    if (existing) {
      throw new EmailAlreadyUsed();
    }

    const user = User.register({
      id: randomUUID(),
      email,
      displayName: input.displayName,
      passwordHash: await this.passwords.hash(input.password),
      now: new Date(),
    });
    await this.users.save(user);
    return toUserView(user);
  }
}
