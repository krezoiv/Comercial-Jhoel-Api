import { DomainError } from '../../../../shared/domain/domain-error';

export class DayNotFoundError extends DomainError {
  readonly status = 404;

  constructor(date: string) {
    super(`No existe ningún ciclo registrado para la fecha ${date}.`);
  }
}
