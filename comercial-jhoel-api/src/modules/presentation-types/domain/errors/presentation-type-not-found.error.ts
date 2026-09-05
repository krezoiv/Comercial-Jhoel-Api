import { DomainError } from '../../../../shared/domain/domain-error';

export class PresentationTypeNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Tipo de presentación no encontrado: ${identifier}`);
  }
}
