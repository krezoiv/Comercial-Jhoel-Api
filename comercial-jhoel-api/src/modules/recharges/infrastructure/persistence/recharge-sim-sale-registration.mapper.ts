import { RechargeSimSaleRegistration } from '../../domain/entities/recharge-sim-sale-registration.entity';

/** Shape of one row from the hand-written JOIN query in `TypeOrmRechargeSimSaleRegistrationRepository` — no TypeORM entity exists for this table (same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sales`/`recharge_sim_purchases` themselves), so this mapper works off a plain joined row instead of an `*.orm-entity.ts`. */
export interface RechargeSimSaleRegistrationRow {
  id: string;
  recharge_sim_sale_id: string;
  sim_type_id: string;
  sim_type_name: string;
  sim_number: string;
  sku: string;
  client_dpi: string;
  client_id: string | null;
  client_name: string | null;
  sale_price: string;
  sale_date: string;
  has_dpi_image: boolean;
  is_voided: boolean;
  voided_at: Date | null;
  voided_by: string | null;
  voided_by_username: string | null;
  void_reason: string | null;
  created_by: string;
  created_by_username: string;
  created_at: Date;
}

export const RechargeSimSaleRegistrationMapper = {
  toDomain(row: RechargeSimSaleRegistrationRow): RechargeSimSaleRegistration {
    return RechargeSimSaleRegistration.create({
      id: row.id,
      rechargeSimSaleId: row.recharge_sim_sale_id,
      simTypeId: row.sim_type_id,
      simTypeName: row.sim_type_name,
      simNumber: row.sim_number,
      sku: row.sku,
      clientDpi: row.client_dpi,
      clientId: row.client_id,
      clientName: row.client_name,
      salePrice: parseFloat(row.sale_price),
      saleDate: row.sale_date,
      hasDpiImage: row.has_dpi_image,
      isVoided: row.is_voided,
      voidedAt: row.voided_at,
      voidedBy: row.voided_by,
      voidedByUsername: row.voided_by_username,
      voidReason: row.void_reason,
      createdBy: row.created_by,
      createdByUsername: row.created_by_username,
      createdAt: row.created_at,
    });
  },
};
