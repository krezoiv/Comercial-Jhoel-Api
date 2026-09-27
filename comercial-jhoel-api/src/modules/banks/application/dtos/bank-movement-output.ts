import {
  BankAccountMovement,
  BankTransfer,
} from '../../domain/entities/bank-account-movement.entity';

/** El ledger ya es una proyección plana de solo lectura — la salida es la misma forma. */
export type BankMovementOutput = BankAccountMovement;
export type BankTransferOutput = BankTransfer;

export interface PaginatedBankMovementsOutput {
  items: BankMovementOutput[];
  total: number;
  page: number;
  limit: number;
}
