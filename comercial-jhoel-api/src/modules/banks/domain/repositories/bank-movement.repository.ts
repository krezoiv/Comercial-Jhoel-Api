import {
  BankAccountMovement,
  BankMovementType,
  BankTransfer,
} from '../entities/bank-account-movement.entity';

export const BANK_MOVEMENT_REPOSITORY = Symbol('BANK_MOVEMENT_REPOSITORY');

export interface RegisterBankTransferData {
  sourceBankId: string;
  destinationBankId: string;
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

export interface BankMovementFilters {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  movementType?: BankMovementType;
  userId?: string;
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
  findTransfers(
    filters: Pick<BankMovementFilters, 'startDate' | 'endDate' | 'bankId'>,
    limit: number,
  ): Promise<BankTransfer[]>;
}
