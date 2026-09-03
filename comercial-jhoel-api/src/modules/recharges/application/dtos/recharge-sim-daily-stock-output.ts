import { RechargeSimDailyStock } from '../../domain/entities/recharge-sim-daily-stock.entity';

export interface RechargeSimDailyStockOutput {
  id: string;
  simTypeId: string;
  simTypeName: string;
  date: string;
  previousStock: number;
  purchasedQuantity: number;
  purchasedTotal: number;
  soldQuantity: number;
  soldTotal: number;
  currentStock: number;
  createdByUsername: string;
  updatedByUsername: string | null;
}

export function toRechargeSimDailyStockOutput(
  stock: RechargeSimDailyStock,
): RechargeSimDailyStockOutput {
  return {
    id: stock.id,
    simTypeId: stock.simTypeId,
    simTypeName: stock.simTypeName,
    date: stock.date,
    previousStock: stock.previousStock,
    purchasedQuantity: stock.purchasedQuantity,
    purchasedTotal: stock.purchasedTotal,
    soldQuantity: stock.soldQuantity,
    soldTotal: stock.soldTotal,
    currentStock: stock.currentStock,
    createdByUsername: stock.createdByUsername,
    updatedByUsername: stock.updatedByUsername,
  };
}
