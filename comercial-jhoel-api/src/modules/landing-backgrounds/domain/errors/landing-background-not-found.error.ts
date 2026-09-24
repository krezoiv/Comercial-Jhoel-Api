import { DomainError } from '../../../../shared/domain/domain-error';

export class LandingBackgroundNotFoundError extends DomainError {
  readonly status = 404;

  constructor(id: string) {
    super(`No se encontró el fondo de landing con id: ${id}`);
  }
}
