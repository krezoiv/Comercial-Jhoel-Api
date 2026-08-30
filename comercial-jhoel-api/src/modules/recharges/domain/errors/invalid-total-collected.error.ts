import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidTotalCollectedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El total recaudado no puede ser negativo.');
  }
}
