export class BankDepositCashDetailResponseDto {
  id: string;
  denomination: number;
  quantity: number;
  subtotal: number;
}

export class BankDepositTransactionResponseDto {
  id: string;
  sequence: number;
  amount: number;
}

export class BankDepositOperationResponseDto {
  id: string;
  transactionBankId: string;
  transactionBankName: string;
  totalAmount: number;
  transactionCount: number;
  totalCash: number;
  totalDistributed: number;
  operationDate: string;
  clientName: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  cashDetails: BankDepositCashDetailResponseDto[];
  transactions: BankDepositTransactionResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export class BankDepositOperationSummaryResponseDto {
  id: string;
  transactionBankId: string;
  transactionBankName: string;
  totalAmount: number;
  transactionCount: number;
  operationDate: string;
  clientName: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export class PaginatedBankDepositOperationsResponseDto {
  items: BankDepositOperationSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
