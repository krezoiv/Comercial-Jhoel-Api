import { DomainError } from '../../../../shared/domain/domain-error';

export class SimNumberRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El número de SIM es obligatorio.');
  }
}
