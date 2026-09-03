import { DomainError } from '../../../../shared/domain/domain-error';

export class RechargeDayCancelledError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día de recargas ${date} fue anulado y no puede ser modificado.`);
  }
}

export class RechargeDayAlreadyCancelledError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día de recargas ${date} ya fue anulado anteriormente.`);
  }
}
