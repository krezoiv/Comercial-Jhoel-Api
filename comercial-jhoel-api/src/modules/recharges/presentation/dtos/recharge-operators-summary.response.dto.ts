export class RechargeOperatorStatDto {
  rechargeTypeId: string;
  rechargeTypeName: string;
  salesThisMonth: number;
  purchasesThisMonth: number;
  currentBalance: number;
  balanceLimit: number;
}

export class RechargeOperatorsSummaryResponseDto {
  month: string;
  operators: RechargeOperatorStatDto[];
}
