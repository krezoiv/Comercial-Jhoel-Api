import {
  CashBoxMovementType,
  SalesCashBoxMovement,
} from '../entities/sales-cash-box-movement.entity';

export const SALES_CASH_BOX_MOVEMENT_REPOSITORY = Symbol(
  'SALES_CASH_BOX_MOVEMENT_REPOSITORY',
);

export interface RegisterSalesCashBoxMovementData {
  businessId: string;
  amount: number;
  movementType: CashBoxMovementType;
  concept: string;
  userId: string;
}

/** One negocio's accumulated (all-time, never reset) balance. */
export interface SalesCashBoxBalance {
  businessId: string;
  businessName: string;
  balance: number;
}

export interface SalesCashBoxMovementRepository {
  /** Invokes `register_sales_cash_box_movement` — validates and inserts atomically, serialized per `businessId` via an advisory lock (never blocks a different negocio's movement). The balance-exceeded check only applies when `movementType === 'WITHDRAWAL'`. */
  registerMovement(
    data: RegisterSalesCashBoxMovementData,
  ): Promise<SalesCashBoxMovement>;
  /** Plain conditional `UPDATE` — no stored function needed, same "don't build a procedure where a plain statement is already correct" call as `TypeOrmRechargeCashBoxRepository.voidMovement`. */
  voidMovement(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<SalesCashBoxMovement>;
  findById(id: string): Promise<SalesCashBoxMovement | null>;
  /** Every active negocio's balance, in one query — never one call per business. */
  getBalances(): Promise<SalesCashBoxBalance[]>;
  /** Most recent movements for one negocio (voided included, for a full audit trail — the frontend marks them accordingly). */
  findMovements(businessId: string, limit: number): Promise<SalesCashBoxMovement[]>;
}
