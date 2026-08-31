import { DomainError } from '../../../../shared/domain/domain-error';

export class DayCancelledError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día ${date} fue anulado y no puede ser modificado.`);
  }
}

export class DayAlreadyCancelledError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día ${date} ya fue anulado anteriormente.`);
  }
}
