import { RechargeCashBoxMovement } from '../../domain/entities/recharge-cash-box-movement.entity';
import { CashBoxMovementType } from '../../domain/entities/recharge-cash-box-movement.entity';

export interface CashBoxMovementOutput {
  id: string;
  amount: number;
  movementType: CashBoxMovementType;
  businessDate: string;
  concept: string;
  createdByUsername: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export function toCashBoxMovementOutput(
  movement: RechargeCashBoxMovement,
): CashBoxMovementOutput {
  return {
    id: movement.id,
    amount: movement.amount,
    movementType: movement.movementType,
    businessDate: movement.businessDate,
    concept: movement.concept,
    createdByUsername: movement.createdByUsername,
    createdAt: movement.createdAt,
    isVoided: movement.isVoided,
    voidedAt: movement.voidedAt,
    voidedByUsername: movement.voidedByUsername,
    voidReason: movement.voidReason,
  };
}
