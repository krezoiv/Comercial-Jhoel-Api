export const BANK_MOVEMENT_TYPES = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
  'TRANSFERENCIA_SALIDA',
  'TRANSFERENCIA_ENTRADA',
  'RETIRO_EFECTIVO',
  'AJUSTE_MANUAL',
  'SALDO_INICIAL',
  'ANULACION',
  /** Finanzas → Transferencias Bancarias → "Acreditar saldo": suma directa a una cuenta, sin contrapartida (≠ Depósito de Transaccionar). */
  'ACREDITACION_SALDO',
] as const;
export type BankMovementType = (typeof BANK_MOVEMENT_TYPES)[number];

export const BANK_MOVEMENT_ORIGINS = [
  'TRANSACCIONAR',
  'TRANSFERENCIA',
  'AJUSTE_MANUAL',
  'SALDO_INICIAL',
  'ANULACION',
  'ACREDITACION_SALDO',
] as const;
export type BankMovementOrigin = (typeof BANK_MOVEMENT_ORIGINS)[number];

export type BankMovementStatus = 'APLICADO' | 'ANULADO';

/**
 * Reglas especiales de una cuenta (`banks.special_account`) — ver la
 * migración `CreateBankAccountMovements`. `GENESIS` puede quedar en negativo
 * ("saldo a favor"); `BI_CLUB` solo recibe de `BANCO_INDUSTRIAL`; `DISTRICOL`
 * solo recibe de `BANCO_AGROMERCANTIL`.
 */
export const BANK_SPECIAL_ACCOUNTS = [
  'GENESIS',
  'BI_CLUB',
  'DISTRICOL',
  'BANCO_INDUSTRIAL',
  'BANCO_AGROMERCANTIL',
] as const;
export type BankSpecialAccount = (typeof BANK_SPECIAL_ACCOUNTS)[number];

/**
 * Un renglón del ledger `bank_account_movements` — proyección de solo
 * lectura (la escritura siempre pasa por las funciones SQL). `amount` es el
 * delta con signo: `balanceBefore + amount === balanceAfter` siempre (lo
 * garantiza un CHECK en la base de datos).
 */
export interface BankAccountMovement {
  id: string;
  sequence: number;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  movementType: BankMovementType;
  origin: BankMovementOrigin;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  businessDate: string;
  createdAt: Date;
  userId: string;
  username: string;
  referenceType: string | null;
  referenceId: string | null;
  referenceText: string | null;
  concept: string | null;
  observation: string | null;
  counterpartBankId: string | null;
  counterpartBankName: string | null;
  counterpartAccountNumber: string | null;
  status: BankMovementStatus;
  reversalOfId: string | null;
  reversedAt: Date | null;
  reversedByUsername: string | null;
}

/** `TRANSFER` = de una cuenta a otra; `CASH_WITHDRAWAL` = retiro de efectivo en banco (solo sale del origen). */
export type BankTransferKind = 'TRANSFER' | 'CASH_WITHDRAWAL';

/** Vista de una transferencia: su salida (origen) y su entrada (destino) juntas — `destination` es `null` en un retiro de efectivo. */
export interface BankTransfer {
  id: string;
  kind: BankTransferKind;
  businessDate: string;
  createdAt: Date;
  amount: number;
  userId: string;
  username: string;
  referenceText: string | null;
  concept: string | null;
  status: BankMovementStatus;
  source: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    balanceBefore: number;
    balanceAfter: number;
  };
  destination: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    balanceBefore: number;
    balanceAfter: number;
  } | null;
}
