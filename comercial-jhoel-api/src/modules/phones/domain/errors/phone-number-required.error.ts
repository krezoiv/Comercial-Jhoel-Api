import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneNumberRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El número de teléfono asignado es obligatorio.');
  }
}
