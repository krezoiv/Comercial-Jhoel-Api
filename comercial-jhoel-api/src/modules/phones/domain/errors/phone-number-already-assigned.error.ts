import { DomainError } from '../../../../shared/domain/domain-error';

/** Raised by `register_phone_sale` when the número asignado is already claimed by another currently-`VENDIDO` phone (`UQ_phones_phone_number_active`). */
export class PhoneNumberAlreadyAssignedError extends DomainError {
  readonly status = 409;

  constructor(phoneId: string) {
    super(
      `El número de teléfono ya está asignado a otro equipo vendido (teléfono ${phoneId}).`,
    );
  }
}
