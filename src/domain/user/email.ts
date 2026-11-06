import { InvalidEmail } from './user.errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const value = raw.trim().toLowerCase();
    if (value.length > 254 || !EMAIL_PATTERN.test(value)) {
      throw new InvalidEmail();
    }
    return new Email(value);
  }
}
