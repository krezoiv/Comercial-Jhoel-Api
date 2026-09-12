import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleRegistrationNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`No se encontró el registro de venta de SIM: ${identifier}`);
  }
}
