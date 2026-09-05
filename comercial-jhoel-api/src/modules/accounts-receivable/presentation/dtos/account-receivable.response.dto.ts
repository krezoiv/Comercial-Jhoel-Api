export class AccountReceivableResponseDto {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class PaginatedAccountsReceivableResponseDto {
  items: AccountReceivableResponseDto[];
  total: number;
  page: number;
  limit: number;
}
