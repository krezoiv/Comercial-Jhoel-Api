import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el teléfono con id: ${id}`);
  }
}
