import { DomainError } from '../../../../shared/domain/domain-error';

export class BusinessNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Negocio no encontrado: ${identifier}`);
  }
}
