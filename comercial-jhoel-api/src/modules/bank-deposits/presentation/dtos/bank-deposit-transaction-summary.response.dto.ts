export class BankDepositSummaryByBankDto {
  transactionBankId: string;
  transactionBankName: string;
  transactions: number;
}

export class BankDepositPeriodSummaryDto {
  totalTransactions: number;
  byBank: BankDepositSummaryByBankDto[];
}

export class BankDepositTransactionSummaryResponseDto {
  daily: BankDepositPeriodSummaryDto;
  monthly: BankDepositPeriodSummaryDto;
}
