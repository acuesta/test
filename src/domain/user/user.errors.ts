import { DomainError } from '../shared/domain-error';

export class InvalidEmail extends DomainError {
  constructor() {
    super('Email is not valid', 'EMAIL_INVALID');
  }
}

export class WeakPassword extends DomainError {
  constructor() {
    super(
      'Password must be 8 to 72 characters and include a letter and a number',
      'PASSWORD_TOO_WEAK',
    );
  }
}

export class InvalidDisplayName extends DomainError {
  constructor() {
    super('Display name must be between 1 and 80 characters', 'DISPLAY_NAME_INVALID');
  }
}

export class EmailAlreadyUsed extends DomainError {
  constructor() {
    super('Email is already registered', 'EMAIL_ALREADY_USED');
  }
}

export class InvalidCredentials extends DomainError {
  constructor() {
    super('Email or password is incorrect', 'INVALID_CREDENTIALS');
  }
}

export class UserDisabled extends DomainError {
  constructor() {
    super('User is disabled', 'USER_DISABLED');
  }
}

export class UserNotFound extends DomainError {
  constructor() {
    super('User was not found', 'USER_NOT_FOUND');
  }
}
