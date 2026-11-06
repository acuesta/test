import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../domain/user/password-hasher';

const COST = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, COST);
  }

  async verify(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
