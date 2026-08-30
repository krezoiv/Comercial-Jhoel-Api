import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidRechargeDateRangeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de inicio debe ser anterior o igual a la fecha final.');
  }
}
