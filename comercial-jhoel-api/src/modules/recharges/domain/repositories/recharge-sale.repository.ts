import { RechargeSale } from '../entities/recharge-sale.entity';

export const RECHARGE_SALE_REPOSITORY = Symbol('RECHARGE_SALE_REPOSITORY');

export interface CreateRechargeSaleData {
  rechargeTypeId: string;
  date: string;
  phoneNumber: string;
  amount: number;
  userId: string;
}

export interface UpdateRechargeSaleData {
  id: string;
  phoneNumber: string;
  amount: number;
  userId: string;
}

export interface RechargeTypeSalesTotal {
  rechargeTypeId: string;
  rechargeTypeName: string;
  total: number;
}

export interface RechargeSaleRepository {
  /** Invokes `register_recharge_sale` — validates the type/amount/phone, resolves the CURRENT cycle row for (type, date), and records the movement. */
  create(data: CreateRechargeSaleData): Promise<RechargeSale>;
  /** Invokes `update_recharge_sale` — rejects if the referenced cycle is already closed. */
  update(data: UpdateRechargeSaleData): Promise<RechargeSale>;
  /** Invokes `delete_recharge_sale` — rejects if the referenced cycle is already closed. */
  delete(id: string): Promise<void>;
  findById(id: string): Promise<RechargeSale | null>;
  /** Every sale recorded under the CURRENT cycle of each type, for one date — backs the sales table. */
  findAllByDate(date: string): Promise<RechargeSale[]>;
  /** SUM(amount) per type, scoped to each type's CURRENT cycle for `date` — feeds the Resumen de Ventas y Cuadre cards and the closure's own totals. */
  getCurrentCycleTotalsByDate(date: string): Promise<RechargeTypeSalesTotal[]>;
}
