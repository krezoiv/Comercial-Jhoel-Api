import { RechargeSimSale } from '../../domain/entities/recharge-sim-sale.entity';

/** Shape of one row from `TypeOrmRechargeSimSaleRepository`'s own JOIN query — no TypeORM entity exists for `recharge_sim_sales` (same "raw SQL, no ORM entity" precedent already established for this table's own write functions), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. */
export interface RechargeSimSaleRow {
  id: string;
  sim_type_id: string;
  sim_type_name: string;
  daily_stock_id: string;
  quantity: number;
  unit_price: string;
  total_amount: string;
  sale_date: string;
  has_active_registration: boolean;
  created_by: string;
  created_by_username: string;
  created_at: Date;
  is_voided: boolean;
  voided_at: Date | null;
  voided_by: string | null;
  voided_by_username: string | null;
  void_reason: string | null;
}

export const RechargeSimSaleMapper = {
  toDomain(row: RechargeSimSaleRow): RechargeSimSale {
    return RechargeSimSale.create({
      id: row.id,
      simTypeId: row.sim_type_id,
      simTypeName: row.sim_type_name,
      dailyStockId: row.daily_stock_id,
      quantity: row.quantity,
      unitPrice: parseFloat(row.unit_price),
      totalAmount: parseFloat(row.total_amount),
      saleDate: row.sale_date,
      hasActiveRegistration: row.has_active_registration,
      createdBy: row.created_by,
      createdByUsername: row.created_by_username,
      createdAt: row.created_at,
      isVoided: row.is_voided,
      voidedAt: row.voided_at,
      voidedBy: row.voided_by,
      voidedByUsername: row.voided_by_username,
      voidReason: row.void_reason,
    });
  },
};
