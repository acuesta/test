import { normalizeDisplayName } from './display-name';
import { Email } from './email';
import { UserDisabled } from './user.errors';

export type UserStatus = 'active' | 'disabled';

export interface RegisterUserProps {
  id: string;
  email: Email;
  displayName: string;
  passwordHash: string;
  now: Date;
}

export class User {
  private constructor(
    readonly id: string,
    private readonly email: Email,
    private displayName: string,
    private passwordHash: string,
    private status: UserStatus,
    readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static register(props: RegisterUserProps): User {
    return new User(
      props.id,
      props.email,
      normalizeDisplayName(props.displayName),
      props.passwordHash,
      'active',
      props.now,
      props.now,
    );
  }

  getEmail(): string {
    return this.email.value;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  ensureCanAuthenticate(): void {
    if (this.status === 'disabled') {
      throw new UserDisabled();
    }
  }

  replacePassword(passwordHash: string, now: Date): void {
    this.passwordHash = passwordHash;
    this.updatedAt = now;
  }
}
