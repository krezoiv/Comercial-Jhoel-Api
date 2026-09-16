import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneSaleNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró la venta de teléfono con id: ${id}`);
  }
}
