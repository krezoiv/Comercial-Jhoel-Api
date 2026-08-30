import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeTypeInactiveError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El tipo de recarga indicado no está activo.');
  }
}
