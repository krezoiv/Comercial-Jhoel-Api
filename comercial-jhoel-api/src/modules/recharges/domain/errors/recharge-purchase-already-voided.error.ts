import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargePurchaseAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Esta compra ya fue revertida anteriormente.');
  }
}
