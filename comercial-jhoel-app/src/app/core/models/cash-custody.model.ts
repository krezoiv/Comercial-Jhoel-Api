/**
 * Control de Efectivo → "Arqueo de Caja" and "Bodega" (cash under custody).
 * Caja and Bodega balances come from their own Kardex in the backend; the UI
 * never computes them.
 */

export type CashCountResult = 'CUADRADO' | 'FALTANTE' | 'SOBRANTE';

export interface CashCustody {
  cashBalance: number;
  warehouseBalance: number;
  custodyTotal: number;
  warehouseHasInitialBalance: boolean;
  warehouseLastMovementAt: string | null;
  currentDay: { businessDate: string; isOpen: boolean } | null;
  deliveredToday: number;
}

export interface CashDenominationRow {
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface WarehouseTransfer {
  id: string;
  referenceNumber: string;
  amount: number;
  deliveredBy: string;
  receivedBy: string;
  voucherReference: string | null;
  observations: string | null;
  hasBreakdown: boolean;
  businessDate: string;
  cashMovementId: string;
  cashMovementSequence: number;
  warehouseMovementId: string;
  warehouseMovementSequence: number;
  status: 'APLICADA' | 'ANULADA';
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: string;
  details: CashDenominationRow[];
}

export interface WarehouseMovement {
  id: string;
  sequence: number;
  businessDate: string | null;
  movementType: 'SALDO_INICIAL' | 'ENTREGA_DESDE_CAJA' | 'ANULACION';
  direction: 'IN' | 'OUT';
  amount: number;
  previousBalance: number;
  newBalance: number;
  referenceType: string | null;
  referenceId: string | null;
  transferReference: string | null;
  description: string;
  counterpart: string | null;
  reason: string | null;
  status: 'VIGENTE' | 'ANULADO';
  createdByUsername: string;
  createdAt: string;
}

export interface CashCountRecord {
  id: string;
  number: number;
  businessDate: string;
  countedAt: string;
  systemCash: number;
  totalCounted: number;
  difference: number;
  result: CashCountResult;
  warehouseBalance: number;
  warehouseCounted: number | null;
  warehouseDifference: number | null;
  custodyTheoretical: number;
  custodyCounted: number;
  custodyDifference: number | null;
  observations: string | null;
  status: 'VIGENTE' | 'REEMPLAZADO';
  replacesId: string | null;
  replacedById: string | null;
  correctionReason: string | null;
  createdByUsername: string;
  createdAt: string;
  details: CashDenominationRow[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CashCountFilters {
  dateFrom?: string;
  dateTo?: string;
  businessDate?: string;
  userId?: string;
  result?: CashCountResult | '';
  page?: number;
  limit?: number;
}

export interface RegisterCashCountInput {
  details: { denomination: number; quantity: number }[];
  observations?: string;
  warehouseCounted?: number;
  clientRequestId: string;
}

export interface RegisterWarehouseTransferInput {
  amount: number;
  details?: { denomination: number; quantity: number }[];
  deliveredBy: string;
  receivedBy: string;
  voucherReference?: string;
  observations?: string;
  clientRequestId: string;
}

export const CASH_COUNT_RESULT_LABEL: Record<CashCountResult, string> = {
  CUADRADO: 'Cuadrado',
  FALTANTE: 'Faltante',
  SOBRANTE: 'Sobrante',
};

/** Roles that may view/register counts and deliveries (UX only — the backend re-checks). */
export const CASH_CUSTODY_OPERATOR_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO'];
