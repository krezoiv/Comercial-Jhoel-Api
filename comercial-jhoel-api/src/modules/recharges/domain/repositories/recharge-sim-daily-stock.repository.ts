import { RechargeSimDailyStock } from '../entities/recharge-sim-daily-stock.entity';

export const RECHARGE_SIM_DAILY_STOCK_REPOSITORY = Symbol(
  'RECHARGE_SIM_DAILY_STOCK_REPOSITORY',
);

export interface RegisterRechargeSimPurchaseData {
  simTypeId: string;
  date: string;
  quantity: number;
  userId: string;
}

export interface RegisterRechargeSimSaleData {
  simTypeId: string;
  date: string;
  quantity: number;
  userId: string;
}

export interface RechargeSimDailyStockRepository {
  /** Invokes `ensure_recharge_sim_daily_stock` — finds this date's row for this SIM type, or lazily creates it with `previousStock` copied from the most recent prior day's `currentStock`. */
  ensureDailyStock(
    simTypeId: string,
    date: string,
    userId: string,
  ): Promise<RechargeSimDailyStock>;
  /** Every SIM type's CURRENT stock row for one date — used to build the cuadre's SIM block. */
  findAllByDate(date: string): Promise<RechargeSimDailyStock[]>;
  findById(id: string): Promise<RechargeSimDailyStock | null>;
  /** Invokes `register_recharge_sim_purchase` — validates the type, reads cost server-side, records the movement, and increments stock, atomically. */
  registerPurchase(
    data: RegisterRechargeSimPurchaseData,
  ): Promise<RechargeSimDailyStock>;
  /** Invokes `register_recharge_sim_sale` — validates the type and available stock, reads price server-side, records the movement, and decrements stock, atomically. */
  registerSale(
    data: RegisterRechargeSimSaleData,
  ): Promise<RechargeSimDailyStock>;
}
