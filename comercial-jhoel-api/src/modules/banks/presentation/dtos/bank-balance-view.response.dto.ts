export class BankBalanceViewResponseDto {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number | null;
}

export class SaveBankBalancesResponseDto {
  savedCount: number;
}
