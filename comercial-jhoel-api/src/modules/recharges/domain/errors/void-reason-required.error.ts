import { DomainError } from '../../../../shared/domain/domain-error';

export class VoidReasonRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe indicar un motivo para revertir la compra.');
  }
}
