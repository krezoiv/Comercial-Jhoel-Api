import { DomainError } from '../../../../shared/domain/domain-error';

export class NoReportTypeSelectedError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe seleccionar al menos un tipo de reporte.');
  }
}
