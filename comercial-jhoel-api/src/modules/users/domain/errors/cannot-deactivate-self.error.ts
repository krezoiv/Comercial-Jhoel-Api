import { DomainError } from '../../../../shared/domain/domain-error';

export class CannotDeactivateSelfError extends DomainError {
  readonly status = 400;

  constructor() {
    super('No puedes desactivar tu propia cuenta.');
  }
}
