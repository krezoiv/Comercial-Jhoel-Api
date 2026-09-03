import { RechargeDailyBalance } from '../../domain/entities/recharge-daily-balance.entity';

export interface RechargeDailyBalanceOutput {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  date: string;
  previousBalance: number;
  /** "Acreditado" — derived (`dailyBalance - previousBalance`), unchanged since before the Monto de Compra/Acreditado split. */
  totalPurchases: number;
  /** "Compra" — real sum of every registered purchase's monto de compra this cycle, purely informational. */
  totalPurchaseAmount: number;
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
    totalPurchaseAmount: balance.totalPurchaseAmount,
    dailyBalance: balance.dailyBalance,
    finalBalance: balance.finalBalance,
    sale: balance.sale,
    createdByUsername: balance.createdByUsername,
    updatedByUsername: balance.updatedByUsername,
  };
}
