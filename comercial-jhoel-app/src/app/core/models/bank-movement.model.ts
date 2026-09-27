/** Espejo de `BANK_MOVEMENT_TYPES` del backend (`bank_account_movements.movement_type`). */
export type BankMovementType =
  | 'DEPOSITO'
  | 'RETIRO'
  | 'DESEMBOLSO_GENESIS'
  | 'PAGO_GENESIS'
  | 'REINTEGRO'
  | 'TRANSFERENCIA_SALIDA'
  | 'TRANSFERENCIA_ENTRADA'
  | 'AJUSTE_MANUAL'
  | 'SALDO_INICIAL'
  | 'ANULACION';

export type BankMovementOrigin = 'TRANSACCIONAR' | 'TRANSFERENCIA' | 'AJUSTE_MANUAL' | 'SALDO_INICIAL' | 'ANULACION';

export type BankMovementStatus = 'APLICADO' | 'ANULADO';

export const BANK_MOVEMENT_TYPE_LABELS: Record<BankMovementType, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro',
  DESEMBOLSO_GENESIS: 'Desembolso Génesis',
  PAGO_GENESIS: 'Pago Génesis',
  REINTEGRO: 'Reintegro',
  TRANSFERENCIA_SALIDA: 'Transferencia (salida)',
  TRANSFERENCIA_ENTRADA: 'Transferencia (entrada)',
  AJUSTE_MANUAL: 'Ajuste manual',
  SALDO_INICIAL: 'Saldo inicial',
  ANULACION: 'Anulación',
};

export const BANK_MOVEMENT_ORIGIN_LABELS: Record<BankMovementOrigin, string> = {
  TRANSACCIONAR: 'Transaccionar',
  TRANSFERENCIA: 'Transferencia',
  AJUSTE_MANUAL: 'Ajuste manual',
  SALDO_INICIAL: 'Saldo inicial',
  ANULACION: 'Anulación',
};

/** Un renglón del historial de movimientos. `amount` lleva signo: `balanceBefore + amount === balanceAfter` siempre. */
export interface BankMovement {
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
  /** Fecha de negocio `yyyy-MM-dd` (America/Guatemala). */
  businessDate: string;
  createdAt: string;
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
  reversedAt: string | null;
  reversedByUsername: string | null;
}

export interface PaginatedBankMovements {
  items: BankMovement[];
  total: number;
  page: number;
  limit: number;
}

export interface BankMovementsFilters {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  movementType?: BankMovementType;
  userId?: string;
  page?: number;
  limit?: number;
}

interface BankTransferSide {
  bankId: string;
  bankName: string;
  accountNumber: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface BankTransfer {
  id: string;
  businessDate: string;
  createdAt: string;
  amount: number;
  userId: string;
  username: string;
  referenceText: string | null;
  concept: string | null;
  status: BankMovementStatus;
  source: BankTransferSide;
  destination: BankTransferSide;
}

export interface BankTransferInput {
  sourceBankId: string;
  destinationBankId: string;
  amount: number;
  referenceText?: string;
  concept?: string;
}

export interface BankBalanceAdjustmentInput {
  newBalance: number;
  reason: string;
  observation?: string;
}

/** Filtros del Reporte de Transferencias Bancarias (`GET /reports/bank-transfers`). */
export interface BankTransfersReportFilters {
  startDate?: string;
  endDate?: string;
  sourceBankId?: string;
  destinationBankId?: string;
  userId?: string;
  status?: BankMovementStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedBankTransfers {
  items: BankTransfer[];
  total: number;
  page: number;
  limit: number;
}

export interface BankTransferRouteSummary {
  sourceBankId: string;
  sourceBankName: string;
  sourceAccountNumber: string;
  destinationBankId: string;
  destinationBankName: string;
  destinationAccountNumber: string;
  transferCount: number;
  totalAmount: number;
}

/** `transferCount`/`totalAmount` excluyen las anuladas (se cuentan aparte en `voidedCount`/`voidedAmount`). */
export interface BankTransfersSummary {
  transferCount: number;
  totalAmount: number;
  voidedCount: number;
  voidedAmount: number;
  byRoute: BankTransferRouteSummary[];
}
