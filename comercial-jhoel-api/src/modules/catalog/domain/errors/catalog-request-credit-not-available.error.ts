import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Thrown by `CreateCatalogRequestUseCase` when `requestType ===
 * 'INTERES_CREDITO'` but the server-side recalculation of
 * `isKrediyaCreditAvailable(price, minAmount)` comes back `false` — the
 * enforcement point for "el backend debe recalcular la disponibilidad según
 * el precio real" even if a manipulated frontend request claims otherwise.
 */
export class CatalogRequestCreditNotAvailableError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Este teléfono no califica actualmente para crédito con Krediya.');
  }
}
