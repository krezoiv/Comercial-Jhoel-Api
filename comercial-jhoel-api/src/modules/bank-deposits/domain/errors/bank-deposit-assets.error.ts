import { DomainError } from '../../../../shared/domain/domain-error';

/** `sendToAssets: true` en un tipo que no es Retiro ni Desembolso Génesis — el servidor nunca confía en que el frontend solo muestre la casilla donde corresponde. */
export class BankDepositAssetsWrongTypeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Solo los retiros y desembolsos Génesis pueden enviarse a Activos.');
  }
}

/** Una misma operación no puede generar cargo en Cuentas por Cobrar y en Activos a la vez. */
export class BankDepositAssetsAndReceivableConflictError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Elija solo un destino: cuentas por cobrar o activos, no ambos.');
  }
}
