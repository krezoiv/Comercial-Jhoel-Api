import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleRegistrationAlreadyVoidedError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`Este registro de venta de SIM ya fue anulado anteriormente: ${identifier}`);
  }
}
