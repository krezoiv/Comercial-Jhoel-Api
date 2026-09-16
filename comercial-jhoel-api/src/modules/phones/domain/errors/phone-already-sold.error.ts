import { DomainError } from '../../../../shared/domain/domain-error';

export class PhoneAlreadySoldError extends DomainError {
  readonly status = 400;

  constructor(id: string) {
    super(
      `Este teléfono ya fue vendido y no puede venderse nuevamente (id: ${id}).`,
    );
  }
}
