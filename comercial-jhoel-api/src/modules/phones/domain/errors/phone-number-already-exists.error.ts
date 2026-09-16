import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneNumberAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(phoneNumber: string) {
    super(`Ya existe un teléfono disponible con el número: ${phoneNumber}`);
  }
}
