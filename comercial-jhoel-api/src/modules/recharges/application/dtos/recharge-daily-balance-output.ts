import { RechargeDailyBalance } from '../../domain/entities/recharge-daily-balance.entity';

export interface RechargeDailyBalanceOutput {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  date: string;
  previousBalance: number;
  totalPurchases: number;
  dailyBalance: number;
  finalBalance: number | null;
  /** `null` until the day is closed (no `finalBalance` registered yet). */
  sale: number | null;
  createdByUsername: string;
  updatedByUsername: string | null;
}

export function toRechargeDailyBalanceOutput(
  balance: RechargeDailyBalance,
): RechargeDailyBalanceOutput {
  return {
    id: balance.id,
    rechargeTypeId: balance.rechargeTypeId,
    rechargeTypeName: balance.rechargeTypeName,
    date: balance.date,
    previousBalance: balance.previousBalance,
    totalPurchases: balance.totalPurchases,
    dailyBalance: balance.dailyBalance,
    finalBalance: balance.finalBalance,
    sale: balance.sale,
    createdByUsername: balance.createdByUsername,
    updatedByUsername: balance.updatedByUsername,
  };
}
