import { SalesCashBoxMovement } from '../../domain/entities/sales-cash-box-movement.entity';
import { CashBoxMovementType } from '../../domain/entities/sales-cash-box-movement.entity';

export interface SalesCashBoxMovementOutput {
  id: string;
  businessId: string;
  amount: number;
  movementType: CashBoxMovementType;
  concept: string;
  createdByUsername: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export function toSalesCashBoxMovementOutput(
  movement: SalesCashBoxMovement,
): SalesCashBoxMovementOutput {
  return {
    id: movement.id,
    businessId: movement.businessId,
    amount: movement.amount,
    movementType: movement.movementType,
    concept: movement.concept,
    createdByUsername: movement.createdByUsername,
    createdAt: movement.createdAt,
    isVoided: movement.isVoided,
    voidedAt: movement.voidedAt,
    voidedByUsername: movement.voidedByUsername,
    voidReason: movement.voidReason,
  };
}
