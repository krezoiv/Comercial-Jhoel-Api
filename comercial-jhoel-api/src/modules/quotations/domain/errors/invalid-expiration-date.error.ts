import { DomainError } from '../../../../shared/domain/domain-error';

/** `expirationDate` may never be before the quotation's own creation date — checked in TypeScript as a fast pre-check (`CreateQuotationUseCase`) in addition to the SQL function's own `INVALID_EXPIRATION_DATE` guard, same "TypeScript pre-check + SQL is the real guarantee" split used throughout this codebase. */
export class InvalidExpirationDateError extends DomainError {
  readonly status = 400;

  constructor() {
    super('La fecha de vencimiento no puede ser anterior a hoy.');
  }
}
