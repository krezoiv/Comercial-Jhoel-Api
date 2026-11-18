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
  /** Returned from Bodega to the caja on the current bank day. */
  returnedToCashToday: number;
  /** Deposited from Bodega into bank accounts on the current bank day. */
  depositedToBankToday: number;
}

export type WarehouseWithdrawalDestination = 'CAJA' | 'BANCO';

/** "Retiro de Bodega": back to the caja or deposited into a bank account. */
export interface WarehouseWithdrawal {
  id: string;
  referenceNumber: string;
  destination: WarehouseWithdrawalDestination;
  amount: number;
  bankId: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  deliveredBy: string;
  receivedBy: string;
  voucherReference: string | null;
  observations: string | null;
  hasBreakdown: boolean;
  businessDate: string;
  warehouseMovementId: string;
  warehouseMovementSequence: number;
  cashMovementId: string | null;
  cashMovementSequence: number | null;
  bankMovementId: string | null;
  status: 'APLICADO' | 'ANULADO';
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: string;
  details: CashDenominationRow[];
}

export interface RegisterWarehouseWithdrawalInput {
  destination: WarehouseWithdrawalDestination;
  amount: number;
  details?: { denomination: number; quantity: number }[];
  bankId?: string;
  deliveredBy: string;
  receivedBy: string;
  voucherReference?: string;
  observations?: string;
  clientRequestId: string;
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
  movementType: 'SALDO_INICIAL' | 'ENTREGA_DESDE_CAJA' | 'DEVOLUCION_A_CAJA' | 'DEPOSITO_BANCARIO' | 'ANULACION';
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

// ── Inventario de efectivo por denominación (migración 1760007800000) ──

export type CashLocation = 'CAJA' | 'BODEGA';

/**
 * Inventory of one location as the backend derives it: the latest physical
 * count (anchor) plus later movements with denominations. `unbroken` is cash
 * that moved without breakdown (balance − knownTotal); never computed here.
 */
export interface LocationInventory {
  location: CashLocation;
  hasAnchor: boolean;
  anchorKind: 'ARQUEO_CAJA' | 'CORTE_CAJA' | 'CONTEO_BODEGA' | null;
  anchorId: string | null;
  anchorNumber: number | null;
  anchorAt: string | null;
  anchorByUsername: string | null;
  balance: number;
  knownTotal: number;
  unbroken: number;
  lines: CashDenominationRow[];
}

export interface CashInventory {
  cash: LocationInventory;
  warehouse: LocationInventory;
}

/** Available quantity per denomination (`String(denomination)` key, same as the breakdown table). */
export function availableByDenomination(inventory: LocationInventory | null): Record<string, number> | null {
  if (!inventory) {
    return null;
  }
  return Object.fromEntries(inventory.lines.map((l) => [String(l.denomination), Math.max(0, l.quantity)]));
}

/** Audited per-denomination count of Bodega (its total equals the Bodega balance). */
export interface WarehouseCashCount {
  id: string;
  number: number;
  countedAt: string;
  businessDate: string;
  warehouseBalance: number;
  totalCounted: number;
  observations: string | null;
  createdByUsername: string;
  details: CashDenominationRow[];
}

export interface RegisterWarehouseCashCountInput {
  details: Array<{ denomination: number; quantity: number }>;
  observations?: string;
  clientRequestId: string;
}

/** What the Arqueo de Caja form had typed — persisted server side per user and bank day. */
export interface CashCountDraftPayload {
  details: Array<{ denomination: number; quantity: number }>;
  observations: string | null;
  countWarehouse: boolean;
  warehouseCounted: number | null;
}

export interface CashCountDraft {
  businessDate: string;
  payload: CashCountDraftPayload;
  version: number;
  updatedAt: string;
}

export type CustodyTransferKind = 'CAJA_A_BODEGA' | 'BODEGA_A_CAJA' | 'BODEGA_A_BANCO';

export const CUSTODY_TRANSFER_KIND_LABEL: Record<CustodyTransferKind, string> = {
  CAJA_A_BODEGA: 'Retiro de caja → Bodega',
  BODEGA_A_CAJA: 'Envío de Bodega → caja',
  BODEGA_A_BANCO: 'Depósito de Bodega → banco',
};

/** One caja ↔ Bodega transfer with its breakdown (unified history). */
export interface CustodyTransfer {
  id: string;
  kind: CustodyTransferKind;
  referenceNumber: string;
  origin: 'CAJA' | 'BODEGA';
  destination: 'CAJA' | 'BODEGA' | 'BANCO';
  bankName: string | null;
  amount: number;
  status: 'APLICADO' | 'ANULADO';
  deliveredBy: string;
  receivedBy: string;
  voucherReference: string | null;
  observations: string | null;
  hasBreakdown: boolean;
  businessDate: string;
  createdById: string;
  createdByUsername: string;
  createdAt: string;
  voidedAt: string | null;
  voidReason: string | null;
  details: CashDenominationRow[];
}

export interface CustodyTransferFilters {
  kind?: CustodyTransferKind;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'APLICADO' | 'ANULADO';
  page?: number;
  limit?: number;
}
