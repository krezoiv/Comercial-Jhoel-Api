import { DomainError } from '../../../../shared/domain/domain-error';

export class SimTypeInactiveError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El tipo de SIM indicado no está activo.');
  }
}
