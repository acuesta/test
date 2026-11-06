import { PasswordHasher } from '../domain/user/password-hasher';
import { assertPasswordPolicy } from '../domain/user/password-policy';
import { InvalidCredentials, UserNotFound } from '../domain/user/user.errors';
import { UserRepository } from '../domain/user/user.repository';

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class ChangePassword {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    assertPasswordPolicy(input.newPassword);
    const user = await this.users.findById(input.userId);
    if (!user) {
      throw new UserNotFound();
    }

    const currentMatches = await this.passwords.verify(
      input.currentPassword,
      user.getPasswordHash(),
    );
    if (!currentMatches) {
      throw new InvalidCredentials();
    }

    user.replacePassword(await this.passwords.hash(input.newPassword), new Date());
    await this.users.save(user);
  }
}
