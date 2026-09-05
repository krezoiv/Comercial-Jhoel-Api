import { DomainError } from '../../../../shared/domain/domain-error';

/** Defensive only — `RegisterMovementRequestDto` already validates `movementType`/`amount` before this ever reaches SQL; these translate `register_asset_movement`'s own guard rails should that validation ever be bypassed. */
export class InvalidMovementTypeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Tipo de movimiento inválido.');
  }
}

export class InvalidMovementAmountError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El monto debe ser mayor a cero.');
  }
}
