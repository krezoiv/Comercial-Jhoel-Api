import { DomainError } from '../../../../shared/domain/domain-error';

/** The referenced client doesn't exist or is deactivated — mirrors InvalidCategoryError/InvalidBusinessError. */
export class InvalidClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente no existe o está inactivo.');
  }
}
