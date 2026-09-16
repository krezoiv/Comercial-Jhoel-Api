import { PhoneOperator } from '../../domain/entities/phone.entity';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';

/** Shape of one row from the hand-written JOIN query in `TypeOrmPhoneSaleRepository` — no TypeORM entity exists for `phone_sales` (it's written exclusively through `register_phone_sale`/`void_phone_sale`), same "raw SQL, no ORM entity" precedent already established for `recharge_sim_sale_registrations`. */
export interface PhoneSaleRow {
  id: string;
  phone_id: string;
  phone_operator: PhoneOperator;
  phone_number: string;
  phone_imei: string;
  phone_cost_price: string;
  client_id: string | null;
  client_name: string | null;
  client_dpi: string;
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

export const PhoneSaleMapper = {
  toDomain(row: PhoneSaleRow): PhoneSale {
    return PhoneSale.create({
      id: row.id,
      phoneId: row.phone_id,
      phoneOperator: row.phone_operator,
      phoneNumber: row.phone_number,
      phoneImei: row.phone_imei,
      phoneCostPrice: parseFloat(row.phone_cost_price),
      clientId: row.client_id,
      clientName: row.client_name,
      clientDpi: row.client_dpi,
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
