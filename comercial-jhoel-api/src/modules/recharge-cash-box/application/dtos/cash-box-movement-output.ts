import { CashBoxHistoryMovementType } from '../../domain/repositories/recharge-cash-box-movement.repository';

export interface CashBoxMovementRowOutput {
  date: string;
  type: CashBoxHistoryMovementType;
  concept: string;
  income: number;
  expense: number;
  balance: number;
  username: string | null;
  movementId: string | null;
}

export interface PaginatedCashBoxMovementsOutput {
  items: CashBoxMovementRowOutput[];
  total: number;
  page: number;
  limit: number;
}
