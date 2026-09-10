export class CashBoxMovementResponseDto {
  date: string;
  type: string;
  concept: string;
  income: number;
  expense: number;
  balance: number;
  username: string | null;
  movementId: string | null;
}

export class PaginatedCashBoxMovementsResponseDto {
  items: CashBoxMovementResponseDto[];
  total: number;
  page: number;
  limit: number;
}
