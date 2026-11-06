import { AccessTokenIssuer } from '../domain/user/access-token-issuer';
import { Email } from '../domain/user/email';
import { PasswordHasher } from '../domain/user/password-hasher';
import { InvalidCredentials } from '../domain/user/user.errors';
import { UserRepository } from '../domain/user/user.repository';
import { toUserView, UserView } from './user-view';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserResult {
  accessToken: string;
  user: UserView;
}

export class AuthenticateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
    private readonly tokens: AccessTokenIssuer,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserResult> {
    const email = Email.create(input.email);
    const user = await this.users.findByEmail(email.value);
    const passwordMatches = user
      ? await this.passwords.verify(input.password, user.getPasswordHash())
      : false;

    if (!user || !passwordMatches) {
      throw new InvalidCredentials();
    }

    user.ensureCanAuthenticate();
    return {
      accessToken: this.tokens.issue({ sub: user.id, email: user.getEmail() }),
      user: toUserView(user),
    };
  }
}
