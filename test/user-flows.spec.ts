import { AuthenticateUser } from '../src/application/authenticate-user';
import { ChangePassword } from '../src/application/change-password';
import { GetUserProfile } from '../src/application/get-user-profile';
import { ListUsers } from '../src/application/list-users';
import { RegisterUser } from '../src/application/register-user';
import { HmacAccessTokenIssuer } from '../src/infrastructure/security/hmac-access-token-issuer';
import { InMemoryUserRepository } from '../src/infrastructure/persistence/in-memory-user.repository';
import { EmailAlreadyUsed, InvalidCredentials } from '../src/domain/user/user.errors';
import { PlainPasswordHasher } from './support/plain-password-hasher';

function buildApp() {
  const users = new InMemoryUserRepository();
  const passwords = new PlainPasswordHasher();
  const tokens = new HmacAccessTokenIssuer('test-secret-value', 3600);
  return {
    register: new RegisterUser(users, passwords),
    authenticate: new AuthenticateUser(users, passwords, tokens),
    changePassword: new ChangePassword(users, passwords),
    profile: new GetUserProfile(users),
    list: new ListUsers(users),
    tokens,
  };
}

describe('user credential flows', () => {
  it('registers a user without returning the password hash', async () => {
    const app = buildApp();
    const user = await app.register.execute({
      email: 'ada@example.com',
      password: 'correcthorse1',
      displayName: 'Ada Lovelace',
    });

    expect(user).toMatchObject({
      email: 'ada@example.com',
      displayName: 'Ada Lovelace',
      status: 'active',
    });
    expect(JSON.stringify(user)).not.toContain('correcthorse1');
    expect(JSON.stringify(user)).not.toContain('hashed:');
  });

  it('rejects a duplicate email', async () => {
    const app = buildApp();
    await app.register.execute({
      email: 'ada@example.com',
      password: 'correcthorse1',
      displayName: 'Ada',
    });

    await expect(
      app.register.execute({
        email: 'Ada@Example.com',
        password: 'anotherpass2',
        displayName: 'Ada Again',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyUsed);
  });

  it('logs in and rotates the password', async () => {
    const app = buildApp();
    const registered = await app.register.execute({
      email: 'ada@example.com',
      password: 'correcthorse1',
      displayName: 'Ada',
    });

    const session = await app.authenticate.execute({
      email: 'ada@example.com',
      password: 'correcthorse1',
    });
    expect(session.user.id).toBe(registered.id);
    expect(app.tokens.verify(session.accessToken).sub).toBe(registered.id);

    await app.changePassword.execute({
      userId: registered.id,
      currentPassword: 'correcthorse1',
      newPassword: 'newpassword2',
    });

    await expect(
      app.authenticate.execute({ email: 'ada@example.com', password: 'correcthorse1' }),
    ).rejects.toBeInstanceOf(InvalidCredentials);

    const next = await app.authenticate.execute({
      email: 'ada@example.com',
      password: 'newpassword2',
    });
    expect(next.user.id).toBe(registered.id);

    const listed = await app.list.execute();
    const profile = await app.profile.execute(registered.id);
    expect(listed).toEqual([profile]);
  });

  it('rejects a wrong password', async () => {
    const app = buildApp();
    await app.register.execute({
      email: 'ada@example.com',
      password: 'correcthorse1',
      displayName: 'Ada',
    });

    await expect(
      app.authenticate.execute({ email: 'ada@example.com', password: 'wrongpass1' }),
    ).rejects.toBeInstanceOf(InvalidCredentials);
  });
});
