export type SalesCashBoxMovementType = 'CONTRIBUTION' | 'WITHDRAWAL';

/** One negocio's accumulated (all-time, never reset) balance — mirrors `SalesCashBoxBalanceOutput`. */
export interface SalesCashBoxBalance {
  businessId: string;
  businessName: string;
  balance: number;
}

/** Mirrors `SalesCashBoxMovementOutput` — one "Aporte"/"Retiro" for one negocio. */
export interface SalesCashBoxMovement {
  id: string;
  businessId: string;
  amount: number;
  movementType: SalesCashBoxMovementType;
  concept: string;
  createdByUsername: string;
  createdAt: string;
  isVoided: boolean;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface RegisterSalesCashBoxMovementInput {
  businessId: string;
  amount: number;
  concept: string;
}
