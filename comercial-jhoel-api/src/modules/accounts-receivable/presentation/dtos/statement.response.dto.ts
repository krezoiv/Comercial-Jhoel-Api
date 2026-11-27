import type { PortfolioRecordTrace } from '../../../../shared/domain/portfolio-record';

export class StatementMovementResponseDto {
  id: string;
  date: string;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  amount: number;
  /** null for a voided row (it no longer counts). */
  balanceAfter: number | null;
  isActive: boolean;
  createdByUsername: string;
  createdAt: Date;
  trace: PortfolioRecordTrace;
}

export class AccountReceivableStatementResponseDto {
  clientId: string;
  clientName: string;
  openingBalance: number;
  movements: StatementMovementResponseDto[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
  voidedCount: number;
}

export class CurrentBalanceResponseDto {
  balance: number;
}

export class ActiveBalanceSummaryResponseDto {
  totalAmount: number;
  recordCount: number;
}
