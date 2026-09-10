import { RechargePurchase } from '../entities/recharge-purchase.entity';

export const RECHARGE_PURCHASE_REPOSITORY = Symbol('RECHARGE_PURCHASE_REPOSITORY');

export interface RechargePurchaseRepository {
  findAllByDate(date: string): Promise<RechargePurchase[]>;
  findById(id: string): Promise<RechargePurchase | null>;
  /** Invokes `void_recharge_purchase` — validates and reverts atomically (see that function's own doc comment for the exact guard order). */
  voidPurchase(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargePurchase>;
}
