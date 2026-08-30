import { RechargeSale } from '../../domain/entities/recharge-sale.entity';

export interface RechargeSaleOutput {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  phoneNumber: string;
  amount: number;
  date: string;
  /** Whether this sale can still be edited/deleted — false once its cycle's saldo final has been registered. */
  locked: boolean;
  createdByUsername: string;
  updatedByUsername: string | null;
}

export function toRechargeSaleOutput(sale: RechargeSale): RechargeSaleOutput {
  return {
    id: sale.id,
    rechargeTypeId: sale.rechargeTypeId,
    rechargeTypeName: sale.rechargeTypeName,
    phoneNumber: sale.phoneNumber,
    amount: sale.amount,
    date: sale.date,
    locked: sale.locked,
    createdByUsername: sale.createdByUsername,
    updatedByUsername: sale.updatedByUsername,
  };
}
