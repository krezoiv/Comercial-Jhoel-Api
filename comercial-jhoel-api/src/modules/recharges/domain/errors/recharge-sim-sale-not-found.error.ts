import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeSimSaleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`No se encontró la venta de SIM: ${identifier}`);
  }
}
