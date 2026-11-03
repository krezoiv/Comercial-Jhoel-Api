export const GUAYACAN_CASH_BOX_REPOSITORY = Symbol(
  'GUAYACAN_CASH_BOX_REPOSITORY',
);

/**
 * Tipos del Kardex de efectivo. INGRESO/EGRESO = ingresos/egresos MANUALES
 * (botones de la caja); TRANSACCION_DEPOSITO/RETIRO = efectivo de
 * Transaccionar; AJUSTE (admin); ANULACION = inverso de un anulado.
 * COMISION_TRANSACCION/REVERSO_COMISION solo existen como historial previo
 * a la migración `GuayacanCashSeparateCommissionsAndTransactions`: las
 * comisiones ya no son efectivo (viven en `guayacan_commissions`).
 */
export const GUAYACAN_CASH_MOVEMENT_TYPES = [
  'INGRESO',
  'EGRESO',
  'TRANSACCION_DEPOSITO',
  'TRANSACCION_RETIRO',
  'AJUSTE',
  'ANULACION',
  'COMISION_TRANSACCION',
  'REVERSO_COMISION',
] as const;
export type GuayacanCashMovementType =
  (typeof GUAYACAN_CASH_MOVEMENT_TYPES)[number];

/** Tipos que un usuario registra a mano — el resto los genera el sistema (Transaccionar, anulaciones). */
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
  /** Movimientos de Transaccionar: la operación que los originó (con su propio desglose de efectivo, si lo tuvo). */
  operation: {
    id: string;
    transactionTypeName: string;
    transactionBankName: string | null;
    totalAmount: number;
    transactionCount: number;
    operationDate: string;
    isVoided: boolean;
    changeGiven: number;
    cashDetails: GuayacanCashDenominationRow[];
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
  /** Comisiones vigentes del período (`guayacan_commissions`) — NUNCA parte del efectivo. */
  commissionTotal: number;
  /** Ingresos / egresos MANUALES vigentes (botones de la caja). */
  manualIncomeTotal: number;
  manualExpenseTotal: number;
  /** Efectivo de Transaccionar vigente: Depósitos (entra) / Retiros (sale). */
  transactionInTotal: number;
  transactionOutTotal: number;
  /** Ajustes vigentes, con signo. */
  adjustmentTotal: number;
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

export type GuayacanCashCountStatus = 'CUADRADO' | 'SOBRANTE' | 'FALTANTE';

export interface GuayacanCashCountRow {
  id: string;
  /** Correlativo inmutable — `number` = "ARQ-0001". */
  sequence: number;
  number: string;
  /** Derivado de la diferencia guardada: 0 → CUADRADO, >0 → SOBRANTE, <0 → FALTANTE. */
  status: GuayacanCashCountStatus;
  /** Último movimiento del Kardex al momento del arqueo (null si la caja no tenía movimientos). */
  lastMovementId: string | null;
  lastMovementSequence: number | null;
  businessDate: string;
  totalCounted: number;
  systemBalance: number;
  difference: number;
  notes: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  details: GuayacanCashDenominationRow[];
}

export interface FindGuayacanCashCountsOptions {
  startDate?: string;
  endDate?: string;
  userId?: string;
  /** Búsqueda por número ("ARQ-0007" / "7"). */
  sequence?: number;
  page: number;
  limit: number;
}

export interface PaginatedGuayacanCashCounts {
  /** Sin `details` en el listado — el detalle completo viene de `findCountById`. */
  items: Omit<GuayacanCashCountRow, 'details'>[];
  total: number;
  page: number;
  limit: number;
}

export interface GuayacanCommissionRow {
  id: string;
  operationId: string;
  transactionTypeName: string;
  businessDate: string;
  transactionCount: number;
  commissionRate: number;
  amount: number;
  status: 'VIGENTE' | 'ANULADO';
  voidedAt: Date | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: Date;
}

export interface PaginatedGuayacanCommissions {
  items: GuayacanCommissionRow[];
  total: number;
  page: number;
  limit: number;
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
  /** Historial de arqueos (Cajas y Cierres), más reciente primero, paginado en SQL. */
  findCounts(
    options: FindGuayacanCashCountsOptions,
  ): Promise<PaginatedGuayacanCashCounts>;
  /** Usuarios que han registrado arqueos (para el filtro). */
  findCountUsers(): Promise<{ id: string; username: string }[]>;
  /** Comisiones (concepto propio, fuera del efectivo), más reciente primero. */
  findCommissions(options: {
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedGuayacanCommissions>;
}
