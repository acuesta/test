import { Email } from '../src/domain/user/email';
import { assertPasswordPolicy } from '../src/domain/user/password-policy';
import { InvalidEmail, WeakPassword } from '../src/domain/user/user.errors';

describe('user rules', () => {
  it('normalizes emails', () => {
    expect(Email.create('  Ada@Example.com ').value).toBe('ada@example.com');
  });

  it('rejects malformed emails', () => {
    expect(() => Email.create('not-an-email')).toThrow(InvalidEmail);
  });

  it('rejects passwords without a letter and a digit', () => {
    expect(() => assertPasswordPolicy('password')).toThrow(WeakPassword);
    expect(() => assertPasswordPolicy('12345678')).toThrow(WeakPassword);
    expect(() => assertPasswordPolicy('short1')).toThrow(WeakPassword);
  });
});
