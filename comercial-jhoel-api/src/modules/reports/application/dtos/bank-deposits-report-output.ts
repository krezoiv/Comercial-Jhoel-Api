export interface BankDepositsReportByBankOutput {
  transactionBankId: string;
  transactionBankName: string;
  operationCount: number;
  totalAmount: number;
}

export interface BankDepositsReportSummaryOutput {
  operationCount: number;
  transactionCount: number;
  totalAmount: number;
  byBank: BankDepositsReportByBankOutput[];
}
