/**
 * Port of "Arqueo de Caja" and "Entrega de Efectivo a Bodega". Caja balance =
 * the cash Kardex; Bodega balance = its own Kardex; every write is one call
 * to the PostgreSQL functions of migration 1760007400000 (locks, idempotency,
 * RBAC, audit). Nothing here computes a balance.
 */
export const CASH_CUSTODY_REPOSITORY = Symbol('CASH_CUSTODY_REPOSITORY');

export const CASH_COUNT_RESULTS = ['CUADRADO', 'FALTANTE', 'SOBRANTE'] as const;
export type CashCountResult = (typeof CASH_COUNT_RESULTS)[number];

/** The three custody indicators. */
export interface CashCustodySnapshot {
  cashBalance: number;
  warehouseBalance: number;
  /** caja + Bodega. */
  custodyTotal: number;
  warehouseHasInitialBalance: boolean;
  warehouseLastMovementAt: Date | null;
  /** Current bank operational day (latest Agentes Bancarios opening). */
  currentDay: { businessDate: string; isOpen: boolean } | null;
  /** Bodega entries received from the caja on the current bank day (net of voids). */
  deliveredToday: number;
}

export interface DenominationRow {
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface WarehouseTransferRow {
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
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: Date;
  details: DenominationRow[];
}

export interface WarehouseMovementRow {
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
  /** Reference number of the related delivery (`ENT-000001`), if any. */
  transferReference: string | null;
  description: string;
  counterpart: string | null;
  reason: string | null;
  status: 'VIGENTE' | 'ANULADO';
  createdByUsername: string;
  createdAt: Date;
}

export interface CashCountRow {
  id: string;
  number: number;
  businessDate: string;
  countedAt: Date;
  systemCash: number;
  totalCounted: number;
  difference: number;
  result: CashCountResult;
  warehouseBalance: number;
  warehouseCounted: number | null;
  warehouseDifference: number | null;
  custodyTheoretical: number;
  /** caja contada + Bodega (contada si se contó, si no teórica). */
  custodyCounted: number;
  /** Consolidated difference, only when Bodega was physically counted. */
  custodyDifference: number | null;
  observations: string | null;
  status: 'VIGENTE' | 'REEMPLAZADO';
  replacesId: string | null;
  replacedById: string | null;
  correctionReason: string | null;
  createdByUsername: string;
  createdAt: Date;
  details: DenominationRow[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FindCashCountsOptions {
  dateFrom?: string;
  dateTo?: string;
  businessDate?: string;
  userId?: string;
  result?: CashCountResult;
  page: number;
  limit: number;
}

export interface FindTransfersOptions {
  dateFrom?: string;
  dateTo?: string;
  status?: 'APLICADA' | 'ANULADA';
  page: number;
  limit: number;
}

export interface RegisterTransferData {
  amount: number;
  details: Array<{ denomination: number; quantity: number }>;
  deliveredBy: string;
  receivedBy: string;
  voucherReference?: string | null;
  observations?: string | null;
  userId: string;
  idempotencyKey: string;
}

export interface RegisterCashCountData {
  details: Array<{ denomination: number; quantity: number }>;
  observations?: string | null;
  warehouseCounted?: number | null;
  userId: string;
  idempotencyKey: string;
  replacesId?: string | null;
  correctionReason?: string | null;
}

export interface CashCustodyRepository {
  getCustody(): Promise<CashCustodySnapshot>;
  registerTransfer(data: RegisterTransferData): Promise<string>;
  voidTransfer(id: string, userId: string, reason: string): Promise<string>;
  findTransfers(
    options: FindTransfersOptions,
  ): Promise<Paginated<WarehouseTransferRow>>;
  findTransferById(id: string): Promise<WarehouseTransferRow | null>;
  registerWarehouseInitialBalance(
    amount: number,
    userId: string,
    reason: string,
    idempotencyKey: string,
  ): Promise<string>;
  findWarehouseMovements(
    page: number,
    limit: number,
  ): Promise<Paginated<WarehouseMovementRow>>;
  registerCount(data: RegisterCashCountData): Promise<string>;
  findCounts(options: FindCashCountsOptions): Promise<Paginated<CashCountRow>>;
  findCountById(id: string): Promise<CashCountRow | null>;
}
