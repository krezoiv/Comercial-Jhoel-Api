import {
  BankAccountMovement,
  BankMovementStatus,
  BankMovementType,
  BankTransfer,
  BankTransferKind,
} from '../entities/bank-account-movement.entity';

export const BANK_MOVEMENT_REPOSITORY = Symbol('BANK_MOVEMENT_REPOSITORY');

export interface RegisterBankTransferData {
  sourceBankId: string;
  /** `null` = retiro de efectivo en banco (solo sale del origen). */
  destinationBankId: string | null;
  amount: number;
  businessDate: string;
  userId: string;
  referenceText: string | null;
  concept: string | null;
}

export interface AdjustBankBalanceData {
  bankId: string;
  newBalance: number;
  businessDate: string;
  userId: string;
  reason: string;
  observation: string | null;
}

export interface LastBankMovement {
  /** Delta con signo del movimiento (positivo = subió). */
  amount: number;
  createdAt: Date;
}

export interface BankMovementFilters {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  movementType?: BankMovementType;
  userId?: string;
}

/** Filtros de transferencias (Transferencias Bancarias y su reporte). */
export interface BankTransferFilters {
  startDate?: string;
  endDate?: string;
  /** Cuenta como origen O destino. */
  bankId?: string;
  sourceBankId?: string;
  destinationBankId?: string;
  userId?: string;
  status?: BankMovementStatus;
  kind?: BankTransferKind;
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
  /** `null` en los retiros de efectivo en banco. */
  destinationBankId: string | null;
  destinationBankName: string | null;
  destinationAccountNumber: string | null;
  transferCount: number;
  totalAmount: number;
}

/** Totales del reporte — `transferCount`/`totalAmount` excluyen las anuladas (mismo criterio que el resto de la Reportería). */
export interface BankTransfersSummary {
  transferCount: number;
  totalAmount: number;
  voidedCount: number;
  voidedAmount: number;
  byRoute: BankTransferRouteSummary[];
}

export interface PaginatedBankMovements {
  items: BankAccountMovement[];
  total: number;
  page: number;
  limit: number;
}

/**
 * El ledger de saldos bancarios. Toda escritura delega en una función SQL
 * (`register_bank_transfer`, `void_bank_transfer`, `adjust_bank_balance`) —
 * este puerto nunca calcula ni valida un saldo por su cuenta.
 */
export interface BankMovementRepository {
  registerTransfer(data: RegisterBankTransferData): Promise<string>;
  voidTransfer(
    transferId: string,
    businessDate: string,
    userId: string,
    reason: string,
  ): Promise<void>;
  adjustBalance(data: AdjustBankBalanceData): Promise<BankAccountMovement>;
  findMovements(
    filters: BankMovementFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedBankMovements>;
  findByReference(
    referenceType: string,
    referenceId: string,
  ): Promise<BankAccountMovement[]>;
  findTransferById(transferId: string): Promise<BankTransfer | null>;
  /** Último movimiento de cada cuenta (sin SALDO_INICIAL): monto con signo y cuándo ocurrió. Cuentas sin movimientos no aparecen. */
  getLastMovementByBank(): Promise<Map<string, LastBankMovement>>;
  findTransfers(
    filters: BankTransferFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedBankTransfers>;
  getTransfersSummary(
    filters: BankTransferFilters,
  ): Promise<BankTransfersSummary>;
}
