import { DomainError } from '../../../../shared/domain/domain-error';

export class PresentationTypeCodeAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(code: string) {
    super(`Ya existe una presentación activa con el código: ${code}`);
  }
}
