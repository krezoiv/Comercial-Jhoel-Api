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
  /** Cash returned from Bodega to the caja on the current bank day (net of voids). */
  returnedToCashToday: number;
  /** Cash deposited from Bodega into bank accounts on the current bank day (net of voids). */
  depositedToBankToday: number;
}

export const WAREHOUSE_WITHDRAWAL_DESTINATIONS = ['CAJA', 'BANCO'] as const;
export type WarehouseWithdrawalDestination =
  (typeof WAREHOUSE_WITHDRAWAL_DESTINATIONS)[number];

/** "Retiro de Bodega": back to the caja or deposited into a bank account. */
export interface WarehouseWithdrawalRow {
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
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdByUsername: string;
  createdAt: Date;
  details: DenominationRow[];
}

export interface RegisterWithdrawalData {
  destination: WarehouseWithdrawalDestination;
  amount: number;
  details: Array<{ denomination: number; quantity: number }>;
  bankId?: string | null;
  deliveredBy: string;
  receivedBy: string;
  voucherReference?: string | null;
  observations?: string | null;
  userId: string;
  idempotencyKey: string;
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
  movementType:
    | 'SALDO_INICIAL'
    | 'ENTREGA_DESDE_CAJA'
    | 'DEVOLUCION_A_CAJA'
    | 'DEPOSITO_BANCARIO'
    | 'ANULACION';
  direction: 'IN' | 'OUT';
  amount: number;
  previousBalance: number;
  newBalance: number;
  referenceType: string | null;
  referenceId: string | null;
  /** Reference number of the related delivery (`ENT-…`) or withdrawal (`RET-…`), if any. */
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

/** Which kind of individual cash count a Cuadre de Agentes breakdown can be loaded from. */
export type LatestCashCountSourceKind = 'CORTE_CAJA' | 'ARQUEO_CAJA';

/**
 * One individual cash count record — the arqueo of ONE cut
 * (`cash_cut_counts`) or one standalone Arqueo de Caja (`cash_counts`).
 * Never an aggregate of several counts.
 */
export interface LatestCashCountCandidate {
  source: LatestCashCountSourceKind;
  /** `cash_cut_counts.id` (CORTE_CAJA) or `cash_counts.id` (ARQUEO_CAJA). */
  id: string;
  /** Arqueo number (ARQUEO_CAJA) or null for a cut. */
  number: number | null;
  /** The cut the arqueo belongs to (CORTE_CAJA only). */
  cutPeriodId: string | null;
  cutNumber: 1 | 2 | null;
  businessDate: string;
  countedAt: Date;
  totalCounted: number;
  createdByUsername: string;
  details: DenominationRow[];
}

/** Result of looking up the most recent valid individual count. */
export interface LatestCashCountLookup {
  count: LatestCashCountCandidate | null;
  /** Bank day the lookup preferred (the one requested, else the current bank day). */
  referenceBusinessDate: string | null;
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
  registerWithdrawal(data: RegisterWithdrawalData): Promise<string>;
  voidWithdrawal(id: string, userId: string, reason: string): Promise<string>;
  findWithdrawals(
    options: FindTransfersOptions,
  ): Promise<Paginated<WarehouseWithdrawalRow>>;
  findWithdrawalById(id: string): Promise<WarehouseWithdrawalRow | null>;
  registerCount(data: RegisterCashCountData): Promise<string>;
  findCounts(options: FindCashCountsOptions): Promise<Paginated<CashCountRow>>;
  findCountById(id: string): Promise<CashCountRow | null>;
  /**
   * The arqueo of the "Segundo corte · final del día" (current count of a
   * FINALIZADO cut 2): the reference day's (default: current bank day)
   * first, otherwise the most recent earlier one. Never the first cut, never
   * a standalone Arqueo de Caja, never both cuts added up — its own details only.
   */
  findLatestValidCount(
    preferredBusinessDate: string | null,
  ): Promise<LatestCashCountLookup>;
}
