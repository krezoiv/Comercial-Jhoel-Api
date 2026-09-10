import { RechargePurchase } from '../../domain/entities/recharge-purchase.entity';

export interface RechargePurchaseOutput {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  /** "Monto de Compra" — informational only, never affects the running balance. */
  amount: number;
  /** "Monto Acreditado" — the only value that affects the running balance. */
  creditedAmount: number;
  date: string;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  /** `true` only when the purchase isn't already voided AND its cycle is still open — the exact same two conditions `void_recharge_purchase` itself enforces, exposed here so the frontend never has to re-derive them. */
  canRevert: boolean;
  createdByUsername: string;
}

export function toRechargePurchaseOutput(
  purchase: RechargePurchase,
): RechargePurchaseOutput {
  return {
    id: purchase.id,
    rechargeTypeId: purchase.rechargeTypeId,
    rechargeTypeName: purchase.rechargeTypeName,
    amount: purchase.amount,
    creditedAmount: purchase.creditedAmount,
    date: purchase.date,
    isVoided: purchase.isVoided,
    voidedAt: purchase.voidedAt,
    voidedByUsername: purchase.voidedByUsername,
    voidReason: purchase.voidReason,
    canRevert: !purchase.isVoided && !purchase.locked,
    createdByUsername: purchase.createdByUsername,
  };
}
