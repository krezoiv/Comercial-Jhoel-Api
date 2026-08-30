import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Helado no encontrado: ${identifier}`);
  }
}
