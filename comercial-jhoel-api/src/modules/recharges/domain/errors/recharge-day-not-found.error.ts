import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeDayNotFoundError extends DomainError {
  readonly status = 404;

  constructor(date: string) {
    super(`No existe ningún ciclo de recargas registrado para la fecha ${date}.`);
  }
}
