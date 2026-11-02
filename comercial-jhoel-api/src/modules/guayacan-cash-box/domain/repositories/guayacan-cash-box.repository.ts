export const GUAYACAN_CASH_BOX_REPOSITORY = Symbol(
  'GUAYACAN_CASH_BOX_REPOSITORY',
);

export const GUAYACAN_CASH_MOVEMENT_TYPES = [
  'INGRESO',
  'EGRESO',
  'AJUSTE',
  'COMISION_TRANSACCION',
  'REVERSO_COMISION',
  'ANULACION',
] as const;
export type GuayacanCashMovementType =
  (typeof GUAYACAN_CASH_MOVEMENT_TYPES)[number];

/** Tipos que un usuario registra a mano — el resto los genera el sistema (comisiones, reversos, anulaciones). */
export type GuayacanManualMovementType = 'INGRESO' | 'EGRESO' | 'AJUSTE';

export interface GuayacanCashDenominationData {
  denomination: number;
  quantity: number;
}

export interface GuayacanCashDenominationRow extends GuayacanCashDenominationData {
  subtotal: number;
}

/** Una fila del Kardex — `amount` con signo; `balanceBefore + amount = balanceAfter` siempre (CHECK en la tabla). */
export interface GuayacanCashMovementRow {
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
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
}

export interface GuayacanCashMovementDetail extends GuayacanCashMovementRow {
  cashDetails: GuayacanCashDenominationRow[];
  /** Solo comisiones/reversos: la operación de Transaccionar que los originó. */
  operation: {
    id: string;
    transactionTypeName: string;
    totalAmount: number;
    transactionCount: number;
    operationDate: string;
    isVoided: boolean;
  } | null;
}

export interface RegisterGuayacanCashMovementData {
  movementType: GuayacanManualMovementType;
  /** INGRESO/EGRESO: positivo. AJUSTE: con signo. */
  amount: number;
  businessDate: string;
  userId: string;
  concept: string;
  reason: string | null;
  notes: string | null;
  cashDetails: GuayacanCashDenominationData[];
  /** Idempotencia: el mismo id (un modal abierto) nunca registra dos movimientos. */
  clientRequestId: string | null;
}

export interface FindGuayacanCashMovementsOptions {
  startDate?: string;
  endDate?: string;
  movementType?: GuayacanCashMovementType;
  page: number;
  limit: number;
}

export interface GuayacanPeriodSummary {
  startDate: string;
  endDate: string;
  /** `SUM(transaction_count)` de operaciones Guayacán NO anuladas — transacciones individuales, no operaciones. */
  transactionCount: number;
  operationCount: number;
  /** Comisiones vigentes (no revertidas) del período. */
  commissionTotal: number;
  /** Movimientos vigentes positivos / |negativos| del período. Un anulado y su contrapartida se cancelan (no inflan ninguno de los dos totales). */
  incomeTotal: number;
  expenseTotal: number;
}

export interface GuayacanCashBoxSummary {
  /** Banco agente marcado GUAYACAN — `null` si todavía no se configuró en Sistema → Banco Agente. */
  agent: {
    id: string;
    name: string;
    commissionPerTransaction: number | null;
  } | null;
  /** Saldo del Kardex (último `balance_after`; 0 si no hay movimientos). */
  balance: number;
  today: string;
  daily: GuayacanPeriodSummary;
  weekly: GuayacanPeriodSummary;
  monthly: GuayacanPeriodSummary;
}

export interface GuayacanCashCountRow {
  id: string;
  businessDate: string;
  totalCounted: number;
  systemBalance: number;
  difference: number;
  notes: string | null;
  createdByUsername: string;
  createdAt: Date;
  details: GuayacanCashDenominationRow[];
}

export interface RegisterGuayacanCashCountData {
  businessDate: string;
  userId: string;
  notes: string | null;
  details: GuayacanCashDenominationData[];
  clientRequestId: string | null;
}

export interface PaginatedGuayacanCashMovements {
  items: GuayacanCashMovementRow[];
  total: number;
  page: number;
  limit: number;
}

export interface GuayacanCashBoxRepository {
  /** `register_guayacan_cash_movement` — lock global de la caja, saldo calculado en SQL. Devuelve el id (el existente si `clientRequestId` ya se usó). */
  registerMovement(data: RegisterGuayacanCashMovementData): Promise<string>;
  /** `void_guayacan_cash_movement` — marca ANULADO + movimiento ANULACION inverso. Devuelve el id de la anulación. */
  voidMovement(
    movementId: string,
    businessDate: string,
    userId: string,
    reason: string,
  ): Promise<string>;
  findMovementById(id: string): Promise<GuayacanCashMovementDetail | null>;
  /** Más reciente primero (`sequence DESC`), paginado en SQL. */
  findMovements(
    options: FindGuayacanCashMovementsOptions,
  ): Promise<PaginatedGuayacanCashMovements>;
  /** Día / semana (lunes–domingo) / mes calculados por PostgreSQL en `America/Guatemala`. */
  getSummary(): Promise<GuayacanCashBoxSummary>;
  /** Arqueo: guarda el conteo y la diferencia contra el saldo del Kardex bajo el mismo lock — nunca cambia el saldo. */
  registerCount(data: RegisterGuayacanCashCountData): Promise<string>;
  findLatestCount(): Promise<GuayacanCashCountRow | null>;
  findCountById(id: string): Promise<GuayacanCashCountRow | null>;
}
