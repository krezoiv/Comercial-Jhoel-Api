import { DomainError } from '../../../../shared/domain/domain-error';

/** Max length of "Descripción / Beneficiario" — the same limit as the column and the SQL check. */
export const BANK_DEPOSIT_DESCRIPTION_MAX_LENGTH = 250;

/** "Descripción / Beneficiario" missing or longer than 250 characters (also translated from `BANK_DEPOSIT_DESCRIPTION_TOO_LONG`). */
export class InvalidBankDepositDescriptionError extends DomainError {
  readonly status = 400;

  constructor(reason: 'REQUIRED' | 'TOO_LONG' = 'TOO_LONG') {
    super(
      reason === 'REQUIRED'
        ? 'Ingrese la descripción o el beneficiario de la transacción.'
        : `La descripción no puede superar ${BANK_DEPOSIT_DESCRIPTION_MAX_LENGTH} caracteres.`,
    );
  }
}
