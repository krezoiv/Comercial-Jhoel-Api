import { DomainError } from '../../../../shared/domain/domain-error';

export class ClientNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`El cliente solicitado no existe: ${identifier}`);
  }
}
