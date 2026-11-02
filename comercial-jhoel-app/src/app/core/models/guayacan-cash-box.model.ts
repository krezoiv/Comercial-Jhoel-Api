/** Cuadre de Caja Guayacán — mismo contrato que `GET/POST /guayacan-cash-box/*` (ver el módulo `guayacan-cash-box` del API). */

export type GuayacanCashMovementType =
  | 'INGRESO'
  | 'EGRESO'
  | 'AJUSTE'
  | 'COMISION_TRANSACCION'
  | 'REVERSO_COMISION'
  | 'ANULACION';

export const GUAYACAN_MOVEMENT_TYPE_LABEL: Record<GuayacanCashMovementType, string> = {
  INGRESO: 'Ingreso',
  EGRESO: 'Egreso',
  AJUSTE: 'Ajuste',
  COMISION_TRANSACCION: 'Comisión',
  REVERSO_COMISION: 'Reverso de comisión',
  ANULACION: 'Anulación',
};

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
    totalAmount: number;
    transactionCount: number;
    operationDate: string;
    isVoided: boolean;
  } | null;
}

export interface GuayacanPeriodSummary {
  startDate: string;
  endDate: string;
  transactionCount: number;
  operationCount: number;
  commissionTotal: number;
  incomeTotal: number;
  expenseTotal: number;
}

export interface GuayacanCashBoxSummary {
  agent: { id: string; name: string; commissionPerTransaction: number | null } | null;
  balance: number;
  today: string;
  daily: GuayacanPeriodSummary;
  weekly: GuayacanPeriodSummary;
  monthly: GuayacanPeriodSummary;
}

export interface GuayacanCashCount {
  id: string;
  businessDate: string;
  totalCounted: number;
  systemBalance: number;
  difference: number;
  notes: string | null;
  createdByUsername: string;
  createdAt: string;
  details: GuayacanCashDenominationRow[];
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
