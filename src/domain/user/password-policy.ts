import { WeakPassword } from './user.errors';

export function assertPasswordPolicy(password: string): void {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (password.length < 8 || password.length > 72 || !hasLetter || !hasDigit) {
    throw new WeakPassword();
  }
}
