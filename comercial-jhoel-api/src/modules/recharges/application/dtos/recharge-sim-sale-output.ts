import { RechargeSimSale } from '../../domain/entities/recharge-sim-sale.entity';

export interface RechargeSimSaleOutput {
  id: string;
  simTypeId: string;
  simTypeName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  hasActiveRegistration: boolean;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  /** `true` only when the sale isn't already voided and its day isn't closed — mirrors `void_recharge_sim_sale`'s own two guards (a `hasActiveRegistration` sale never reaches this output at all: the listing query excludes it — see `TypeOrmRechargeSimSaleRepository`'s own doc comment). `dayClosed` is resolved by the caller (`ListRechargeSimSalesUseCase`), since it depends on `recharge_day_openings`, not this entity. */
  canRevert: boolean;
  createdByUsername: string;
}

export function toRechargeSimSaleOutput(
  sale: RechargeSimSale,
  dayClosed: boolean,
): RechargeSimSaleOutput {
  return {
    id: sale.id,
    simTypeId: sale.simTypeId,
    simTypeName: sale.simTypeName,
    quantity: sale.quantity,
    unitPrice: sale.unitPrice,
    totalAmount: sale.totalAmount,
    saleDate: sale.saleDate,
    hasActiveRegistration: sale.hasActiveRegistration,
    isVoided: sale.isVoided,
    voidedAt: sale.voidedAt,
    voidedByUsername: sale.voidedByUsername,
    voidReason: sale.voidReason,
    canRevert: !sale.isVoided && !dayClosed,
    createdByUsername: sale.createdByUsername,
  };
}
