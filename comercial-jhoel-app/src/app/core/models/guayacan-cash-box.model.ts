/** Cuadre de Caja Guayacán — mismo contrato que `GET/POST /guayacan-cash-box/*` (ver el módulo `guayacan-cash-box` del API). */

/**
 * Tipos del Kardex de EFECTIVO. INGRESO/EGRESO = manuales (botones de la
 * caja); TRANSACCION_DEPOSITO/RETIRO = efectivo de Transaccionar. Las
 * comisiones NO son efectivo (`GuayacanCommission`): COMISION_TRANSACCION /
 * REVERSO_COMISION solo aparecen como historial previo a esa separación.
 */
export type GuayacanCashMovementType =
  | 'INGRESO'
  | 'EGRESO'
  | 'TRANSACCION_DEPOSITO'
  | 'TRANSACCION_RETIRO'
  | 'AJUSTE'
  | 'ANULACION'
  | 'COMISION_TRANSACCION'
  | 'REVERSO_COMISION';

export const GUAYACAN_MOVEMENT_TYPE_LABEL: Record<GuayacanCashMovementType, string> = {
  INGRESO: 'Ingreso manual',
  EGRESO: 'Egreso manual',
  TRANSACCION_DEPOSITO: 'Depósito (Transaccionar)',
  TRANSACCION_RETIRO: 'Retiro (Transaccionar)',
  AJUSTE: 'Ajuste',
  ANULACION: 'Anulación',
  COMISION_TRANSACCION: 'Comisión (histórico)',
  REVERSO_COMISION: 'Reverso de comisión',
};

/** Tipos que se ofrecen en el filtro del Kardex (los históricos de comisión siguen visibles en "Todos"). */
export const GUAYACAN_FILTER_MOVEMENT_TYPES: GuayacanCashMovementType[] = [
  'INGRESO',
  'EGRESO',
  'TRANSACCION_DEPOSITO',
  'TRANSACCION_RETIRO',
  'AJUSTE',
  'ANULACION',
];

export interface GuayacanCashDenomination {
  denomination: number;
  quantity: number;
}

export interface GuayacanCashDenominationRow extends GuayacanCashDenomination {
  subtotal: number;
}

/** Una fila del Kardex. `amount` con signo (+ ingreso / − egreso); `balanceBefore + amount = balanceAfter` lo garantiza el backend. */
export interface GuayacanCashMovement {
  id: string;
  sequence: number;
  movementType: GuayacanCashMovementType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  businessDate: string;
  concept: string;
  reason: string | null;
  notes: string | null;
  referenceType: string | null;
  referenceId: string | null;
  transactionCount: number | null;
  commissionRate: number | null;
  reversalOfId: string | null;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export interface GuayacanCashMovementDetail extends GuayacanCashMovement {
  cashDetails: GuayacanCashDenominationRow[];
  operation: {
    id: string;
    transactionTypeName: string;
    transactionBankName: string | null;
    totalAmount: number;
    transactionCount: number;
    operationDate: string;
    isVoided: boolean;
    changeGiven: number;
    /** Desglose físico con que se registró la operación (vacío si fue sin desglose). */
    cashDetails: GuayacanCashDenominationRow[];
  } | null;
}

export interface GuayacanPeriodSummary {
  startDate: string;
  endDate: string;
  transactionCount: number;
  operationCount: number;
  /** Comisiones vigentes — concepto aparte, NUNCA efectivo. */
  commissionTotal: number;
  manualIncomeTotal: number;
  manualExpenseTotal: number;
  /** Efectivo de Transaccionar: Depósitos entran, Retiros salen. */
  transactionInTotal: number;
  transactionOutTotal: number;
  adjustmentTotal: number;
}

export interface GuayacanCashBoxSummary {
  agent: { id: string; name: string; commissionPerTransaction: number | null } | null;
  balance: number;
  today: string;
  daily: GuayacanPeriodSummary;
  weekly: GuayacanPeriodSummary;
  monthly: GuayacanPeriodSummary;
}

export type GuayacanCashCountStatus = 'CUADRADO' | 'SOBRANTE' | 'FALTANTE';

export const GUAYACAN_COUNT_STATUS_LABEL: Record<GuayacanCashCountStatus, string> = {
  CUADRADO: 'Cuadrado',
  SOBRANTE: 'Sobrante',
  FALTANTE: 'Faltante',
};

/** Arqueo guardado — foto histórica e inmutable (saldo del sistema, contado y diferencia de ese momento). */
export interface GuayacanCashCountSummary {
  id: string;
  sequence: number;
  /** "ARQ-0001". */
  number: string;
  status: GuayacanCashCountStatus;
  lastMovementId: string | null;
  lastMovementSequence: number | null;
  businessDate: string;
  totalCounted: number;
  systemBalance: number;
  /** Contado − sistema: 0 cuadra, >0 sobrante, <0 faltante. */
  difference: number;
  notes: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export interface GuayacanCashCount extends GuayacanCashCountSummary {
  /** Las 11 denominaciones tal como se guardaron. */
  details: GuayacanCashDenominationRow[];
}

export interface GuayacanCashCountFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  number?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedGuayacanCashCounts {
  items: GuayacanCashCountSummary[];
  total: number;
  page: number;
  limit: number;
}

/** Comisión de una operación Guayacán — concepto propio, fuera del efectivo de caja. */
export interface GuayacanCommission {
  id: string;
  operationId: string;
  transactionTypeName: string;
  businessDate: string;
  transactionCount: number;
  commissionRate: number;
  amount: number;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: string | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: string;
}

export interface PaginatedGuayacanCommissions {
  items: GuayacanCommission[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedGuayacanCashMovements {
  items: GuayacanCashMovement[];
  total: number;
  page: number;
  limit: number;
}

export interface GuayacanCashMovementFilters {
  startDate?: string;
  endDate?: string;
  movementType?: GuayacanCashMovementType;
  page?: number;
  limit?: number;
}

export interface RegisterGuayacanCashMovementInput {
  movementType: 'INGRESO' | 'EGRESO';
  amount: number;
  businessDate?: string;
  concept: string;
  reason?: string;
  notes?: string;
  cashDetails?: GuayacanCashDenomination[];
  clientRequestId: string;
}

export interface RegisterGuayacanCashAdjustmentInput {
  /** Con signo: + sobrante, − faltante. */
  amount: number;
  businessDate?: string;
  concept: string;
  reason: string;
  notes?: string;
  clientRequestId: string;
}

export interface RegisterGuayacanCashCountInput {
  details: GuayacanCashDenomination[];
  notes?: string;
  clientRequestId: string;
}
