import { DomainError } from '../shared/domain-error';

export class CaseNotFound extends DomainError {
  constructor() {
    super('Case was not found', 'CASE_NOT_FOUND');
  }
}

export class InvalidGuess extends DomainError {
  constructor() {
    super('Name the right number of suspects from this case', 'INVALID_GUESS');
  }
}
