import { DomainError } from '../../../../shared/domain/domain-error';

/** Desglose de efectivo activado pero sin ninguna denominación — no hay nada que cuadrar contra el monto. */
export class CashBreakdownRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Debe incluir el desglose de efectivo o desactivar la opción "Desglose de efectivo".',
    );
  }
}

/** Desglose desactivado pero llegaron denominaciones o vuelto — el servidor nunca registra un desglose que el usuario no habilitó. */
export class CashBreakdownNotExpectedError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'El desglose de efectivo está desactivado: no envíe denominaciones ni vuelto.',
    );
  }
}
