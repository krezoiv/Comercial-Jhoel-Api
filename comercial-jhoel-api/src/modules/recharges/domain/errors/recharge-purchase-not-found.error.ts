import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargePurchaseNotFoundError extends DomainError {
  readonly status = 404;

  constructor() {
    super('La compra indicada no existe.');
  }
}
