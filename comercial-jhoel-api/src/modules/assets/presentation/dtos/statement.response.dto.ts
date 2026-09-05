export class StatementMovementResponseDto {
  id: string;
  date: string;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  amount: number;
  balanceAfter: number;
  createdByUsername: string;
  createdAt: Date;
}

export class AssetStatementResponseDto {
  clientId: string;
  clientName: string;
  openingBalance: number;
  movements: StatementMovementResponseDto[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
}

export class CurrentBalanceResponseDto {
  balance: number;
}

export class ActiveBalanceSummaryResponseDto {
  totalAmount: number;
  recordCount: number;
}
