import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(phone: string) {
    super(`El número de teléfono ya está registrado: ${phone}`);
  }
}
