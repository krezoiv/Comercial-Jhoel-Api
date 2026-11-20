import { Inject, Injectable } from '@nestjs/common';
import { CASH_CUSTODY_REPOSITORY } from '../../domain/repositories/cash-custody.repository';
import type {
  CashCountResult,
  CashCountRow,
  CashCustodyRepository,
  CashCustodySnapshot,
  CashCountDraft,
  CustodyTransferKind,
  CustodyTransferRow,
  LocationInventory,
  WarehouseCashCountRow,
  LatestCashCountCandidate,
  Paginated,
  WarehouseMovementRow,
  WarehouseTransferRow,
  WarehouseWithdrawalDestination,
  WarehouseWithdrawalRow,
} from '../../domain/repositories/cash-custody.repository';
import { assertCashCustodyPermission } from '../../domain/policies/cash-control.policy';
import { cashControlError } from '../../domain/errors/cash-control.errors';
import {
  completeBreakdown,
  type DenominationLine,
} from '../../domain/cash-denominations';

/** The JWT identity every custody use case re-checks. */
export interface CustodyActor {
  userId: string;
  role: string;
}

export interface DenominationInput {
  denomination: number;
  quantity: number;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function page(value?: number): number {
  return Math.max(1, value ?? 1);
}

function limit(value?: number): number {
  return Math.min(200, Math.max(1, value ?? 25));
}

/** Only non-zero rows travel to the transfer (a delivery breakdown lists what was handed over). */
function nonZero(
  details: DenominationInput[] | undefined,
): DenominationInput[] {
  return (details ?? []).filter((row) => row.quantity > 0);
}

/**
 * Every caja ↔ Bodega transfer carries its bills/coins (per-denomination
 * inventory): non-zero rows only, at least one, whole quantities.
 */
function requireBreakdown(
  details: DenominationInput[] | undefined,
): DenominationInput[] {
  const rows = nonZero(details);
  if (rows.length === 0) {
    throw cashControlError('CASH_CUSTODY_BREAKDOWN_REQUIRED');
  }
  if (rows.some((r) => !Number.isInteger(r.quantity) || r.quantity < 0)) {
    throw cashControlError('CASH_INVALID_DENOMINATION');
  }
  return rows;
}

/** "Efectivo en caja / en Bodega / total bajo custodia" — official balances from both Kardex. */
@Injectable()
export class GetCashCustodyUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(actor: { role: string }): Promise<CashCustodySnapshot> {
    assertCashCustodyPermission(actor.role, 'cash_custody.view');
    return this.repository.getCustody();
  }
}

/**
 * "Entrega de Efectivo a Bodega" (retiro de caja hacia Bodega): one atomic SQL
 * call moves the cash from the caja Kardex to the Bodega Kardex (same amount,
 * same reference). Since migration 1760007800000 the breakdown is mandatory
 * and every denomination must be available in the caja inventory (checked by
 * the SQL function under the caja lock).
 */
@Injectable()
export class RegisterWarehouseTransferUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      amount: number;
      details?: DenominationInput[];
      deliveredBy: string;
      receivedBy: string;
      voucherReference?: string;
      observations?: string;
      clientRequestId: string;
    } & CustodyActor,
  ): Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }> {
    assertCashCustodyPermission(input.role, 'cash_custody.operate');
    const details = requireBreakdown(input.details);
    const id = await this.repository.registerTransfer({
      amount: input.amount,
      details,
      deliveredBy: input.deliveredBy.trim(),
      receivedBy: input.receivedBy.trim(),
      voucherReference: input.voucherReference?.trim() || null,
      observations: input.observations?.trim() || null,
      userId: input.userId,
      idempotencyKey: `WHT:${input.clientRequestId}`,
    });
    const [transfer, custody] = await Promise.all([
      this.repository.findTransferById(id),
      this.repository.getCustody(),
    ]);
    if (!transfer) {
      throw cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND');
    }
    return { transfer, custody };
  }
}

/** Voids a delivery (both Kardex reversed together). Admin + reason. */
@Injectable()
export class VoidWarehouseTransferUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: { id: string; reason: string } & CustodyActor,
  ): Promise<{ transfer: WarehouseTransferRow; custody: CashCustodySnapshot }> {
    assertCashCustodyPermission(input.role, 'cash_custody.authorize');
    if (!input.reason || input.reason.trim().length < 5) {
      throw cashControlError('CASH_REASON_REQUIRED');
    }
    await this.repository.voidTransfer(
      input.id,
      input.userId,
      input.reason.trim(),
    );
    const [transfer, custody] = await Promise.all([
      this.repository.findTransferById(input.id),
      this.repository.getCustody(),
    ]);
    if (!transfer) {
      throw cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND');
    }
    return { transfer, custody };
  }
}

/** History of deliveries to Bodega. */
@Injectable()
export class ListWarehouseTransfersUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    dateFrom?: string;
    dateTo?: string;
    status?: 'APLICADA' | 'ANULADA';
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<WarehouseTransferRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findTransfers({
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      status: input.status,
      page: page(input.page),
      limit: limit(input.limit),
    });
  }
}

/** One delivery with both related Kardex movements and its breakdown. */
@Injectable()
export class GetWarehouseTransferUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    id: string;
    role: string;
  }): Promise<WarehouseTransferRow> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    const transfer = await this.repository.findTransferById(input.id);
    if (!transfer) {
      throw cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND');
    }
    return transfer;
  }
}

/** One-time initial balance of Bodega (admin, reason). */
@Injectable()
export class RegisterWarehouseInitialBalanceUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      amount: number;
      reason: string;
      clientRequestId: string;
    } & CustodyActor,
  ): Promise<CashCustodySnapshot> {
    assertCashCustodyPermission(input.role, 'cash_custody.authorize');
    if (!input.reason || input.reason.trim().length < 5) {
      throw cashControlError('CASH_REASON_REQUIRED');
    }
    await this.repository.registerWarehouseInitialBalance(
      input.amount,
      input.userId,
      input.reason.trim(),
      `WHI:${input.clientRequestId}`,
    );
    return this.repository.getCustody();
  }
}

/** Kardex de Bodega (newest first). */
@Injectable()
export class ListWarehouseMovementsUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<WarehouseMovementRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    return this.repository.findWarehouseMovements(
      page(input.page),
      limit(input.limit),
    );
  }
}

/**
 * "Arqueo de Caja": stores the count of the cash physically in the CAJA as a
 * photograph (theoretical caja and the official Bodega balance read under
 * their locks). Bodega is never counted here and never enters the
 * difference (counted caja − theoretical caja); it is only shown as the
 * official balance next to it (total bajo resguardo). It never touches the
 * Kardex; a difference stays recorded as FALTANTE/SOBRANTE. With `replacesId`
 * it is an audited correction (admin + reason) that keeps the original
 * photograph.
 */
@Injectable()
export class RegisterCashCountUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      details: DenominationInput[];
      observations?: string;
      clientRequestId: string;
      replacesId?: string;
      correctionReason?: string;
    } & CustodyActor,
  ): Promise<CashCountRow> {
    assertCashCustodyPermission(input.role, 'cash_custody.operate');
    if (input.replacesId) {
      assertCashCustodyPermission(input.role, 'cash_custody.authorize');
      if (!input.correctionReason || input.correctionReason.trim().length < 5) {
        throw cashControlError('CASH_REASON_REQUIRED');
      }
    }
    if (!input.details?.length) {
      throw cashControlError('CASH_BREAKDOWN_REQUIRED');
    }
    const id = await this.repository.registerCount({
      details: input.details,
      observations: input.observations?.trim() || null,
      userId: input.userId,
      idempotencyKey: `ARQ:${input.clientRequestId}`,
      replacesId: input.replacesId ?? null,
      correctionReason: input.correctionReason?.trim() || null,
    });
    const count = await this.repository.findCountById(id);
    if (!count) {
      throw cashControlError('CASH_COUNT_NOT_FOUND');
    }
    // The confirmed count replaces the user's in-progress draft of this bank
    // day. A correction (admin) is not typed in the draft form, so it keeps it.
    if (!input.replacesId) {
      await this.repository.deleteCountDraft(input.userId);
    }
    return count;
  }
}

/** Historial de arqueos (filters: date, bank day, user, result). */
@Injectable()
export class ListCashCountsUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    dateFrom?: string;
    dateTo?: string;
    businessDate?: string;
    userId?: string;
    result?: CashCountResult;
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<CashCountRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    if (input.businessDate && !DATE.test(input.businessDate)) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findCounts({
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      businessDate: input.businessDate,
      userId: input.userId,
      result: input.result,
      page: page(input.page),
      limit: limit(input.limit),
    });
  }
}

/** One count exactly as it was recorded. */
@Injectable()
export class GetCashCountUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: { id: string; role: string }): Promise<CashCountRow> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    const count = await this.repository.findCountById(input.id);
    if (!count) {
      throw cashControlError('CASH_COUNT_NOT_FOUND');
    }
    return count;
  }
}

/** What "Cargar último arqueo de Caja" receives. */
export interface LatestCashCountOutput {
  /** The second cut's arqueo used (null when no finished second cut exists). */
  count: LatestCashCountCandidate | null;
  /** All 12 denominations (Q0.01 = 0 on counts saved before it existed); empty when `count` is null. */
  breakdown: DenominationLine[];
  /** Bank day the caller works on (requested, else the current bank day). */
  referenceBusinessDate: string | null;
  /** False when the count belongs to an earlier day: the UI must warn, never present it as today's. */
  isFromReferenceDay: boolean;
}

/**
 * Breakdown for Cuadre de Agentes: the arqueo of the "Segundo corte · final
 * del día" (reference day first, else the latest earlier one — flagged by
 * `isFromReferenceDay`). Exactly that cut's quantities, Q0.01 completed with
 * 0 on older cuts; the two cuts are never added up. Read-only.
 */
@Injectable()
export class GetLatestCashCountUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    businessDate?: string;
    role: string;
  }): Promise<LatestCashCountOutput> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    if (input.businessDate && !DATE.test(input.businessDate)) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    const { count, referenceBusinessDate } =
      await this.repository.findLatestValidCount(input.businessDate ?? null);
    return {
      count,
      breakdown: count ? completeBreakdown(count.details) : [],
      referenceBusinessDate,
      isFromReferenceDay:
        !!count && count.businessDate === referenceBusinessDate,
    };
  }
}

/**
 * "Retiro de Bodega": cash leaves Bodega either back to the caja (internal
 * transfer, total custody unchanged) or deposited into a bank account (Bodega
 * down, bank up). One atomic SQL call; without a breakdown it needs
 * `cash_custody.authorize` (same policy as the deliveries).
 */
@Injectable()
export class RegisterWarehouseWithdrawalUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      destination: WarehouseWithdrawalDestination;
      amount: number;
      details?: DenominationInput[];
      bankId?: string;
      deliveredBy: string;
      receivedBy: string;
      voucherReference?: string;
      observations?: string;
      clientRequestId: string;
    } & CustodyActor,
  ): Promise<{
    withdrawal: WarehouseWithdrawalRow;
    custody: CashCustodySnapshot;
  }> {
    assertCashCustodyPermission(input.role, 'cash_custody.operate');
    const details = requireBreakdown(input.details);
    if (input.destination === 'BANCO' && !input.bankId) {
      throw cashControlError('WAREHOUSE_WITHDRAWAL_BANK_REQUIRED');
    }
    const id = await this.repository.registerWithdrawal({
      destination: input.destination,
      amount: input.amount,
      details,
      bankId: input.destination === 'BANCO' ? input.bankId : null,
      deliveredBy: input.deliveredBy.trim(),
      receivedBy: input.receivedBy.trim(),
      voucherReference: input.voucherReference?.trim() || null,
      observations: input.observations?.trim() || null,
      userId: input.userId,
      idempotencyKey: `WHW:${input.clientRequestId}`,
    });
    const [withdrawal, custody] = await Promise.all([
      this.repository.findWithdrawalById(id),
      this.repository.getCustody(),
    ]);
    if (!withdrawal) {
      throw cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND');
    }
    return { withdrawal, custody };
  }
}

/** Voids a withdrawal (both sides reversed together). Admin + reason. */
@Injectable()
export class VoidWarehouseWithdrawalUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: { id: string; reason: string } & CustodyActor): Promise<{
    withdrawal: WarehouseWithdrawalRow;
    custody: CashCustodySnapshot;
  }> {
    assertCashCustodyPermission(input.role, 'cash_custody.authorize');
    if (!input.reason || input.reason.trim().length < 5) {
      throw cashControlError('CASH_REASON_REQUIRED');
    }
    await this.repository.voidWithdrawal(
      input.id,
      input.userId,
      input.reason.trim(),
    );
    const [withdrawal, custody] = await Promise.all([
      this.repository.findWithdrawalById(input.id),
      this.repository.getCustody(),
    ]);
    if (!withdrawal) {
      throw cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND');
    }
    return { withdrawal, custody };
  }
}

/** History of withdrawals from Bodega. */
@Injectable()
export class ListWarehouseWithdrawalsUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    dateFrom?: string;
    dateTo?: string;
    status?: 'APLICADA' | 'ANULADA';
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<WarehouseWithdrawalRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findWithdrawals({
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      status: input.status,
      page: page(input.page),
      limit: limit(input.limit),
    });
  }
}

/** One withdrawal with its related movements and breakdown. */
@Injectable()
export class GetWarehouseWithdrawalUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    id: string;
    role: string;
  }): Promise<WarehouseWithdrawalRow> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    const withdrawal = await this.repository.findWithdrawalById(input.id);
    if (!withdrawal) {
      throw cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND');
    }
    return withdrawal;
  }
}

// ── Inventario por denominación, conteo de Bodega, borradores e historial ──

/** Caja and Bodega inventories by denomination (derived in SQL from counts + movements). */
@Injectable()
export class GetCashInventoryUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(actor: {
    role: string;
  }): Promise<{ cash: LocationInventory; warehouse: LocationInventory }> {
    assertCashCustodyPermission(actor.role, 'cash_custody.view');
    const [cash, warehouse] = await Promise.all([
      this.repository.getInventory('CAJA'),
      this.repository.getInventory('BODEGA'),
    ]);
    return { cash, warehouse };
  }
}

/**
 * "Conteo de Bodega por denominación": the audited reference of the Bodega
 * inventory. Administrators only (`cash_custody.authorize`); the SQL function
 * requires the counted total to equal the Bodega balance and never moves cash.
 */
@Injectable()
export class RegisterWarehouseCashCountUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      details: DenominationInput[];
      observations?: string;
      clientRequestId: string;
    } & CustodyActor,
  ): Promise<{ count: WarehouseCashCountRow; inventory: LocationInventory }> {
    assertCashCustodyPermission(input.role, 'cash_custody.authorize');
    if (!input.details?.length) {
      throw cashControlError('CASH_CUSTODY_BREAKDOWN_REQUIRED');
    }
    const id = await this.repository.registerWarehouseCount({
      details: input.details,
      observations: input.observations?.trim() || null,
      userId: input.userId,
      idempotencyKey: `WHC:${input.clientRequestId}`,
    });
    const [count, inventory] = await Promise.all([
      this.repository.findWarehouseCountById(id),
      this.repository.getInventory('BODEGA'),
    ]);
    if (!count) {
      throw cashControlError('CASH_COUNT_NOT_FOUND');
    }
    return { count, inventory };
  }
}

/** History of Bodega counts. */
@Injectable()
export class ListWarehouseCashCountsUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<WarehouseCashCountRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    return this.repository.findWarehouseCounts(
      page(input.page),
      limit(input.limit),
    );
  }
}

/** The caller's own in-progress Arqueo de Caja for the current bank day (never another user's). */
@Injectable()
export class GetCashCountDraftUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(actor: CustodyActor): Promise<CashCountDraft | null> {
    assertCashCustodyPermission(actor.role, 'cash_custody.operate');
    return this.repository.getCountDraft(actor.userId);
  }
}

/**
 * Autosave of the Arqueo de Caja form. Keyed by the JWT user and the current
 * bank day, so a user can only ever write their own draft. Requires an open
 * bank day (same rule as registering the count).
 */
@Injectable()
export class SaveCashCountDraftUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(
    input: {
      details: DenominationInput[];
      observations?: string;
    } & CustodyActor,
  ): Promise<CashCountDraft> {
    assertCashCustodyPermission(input.role, 'cash_custody.operate');
    const seen = new Set<number>();
    for (const row of input.details ?? []) {
      const key = Math.round(row.denomination * 100);
      if (
        !Number.isInteger(row.quantity) ||
        row.quantity < 0 ||
        seen.has(key)
      ) {
        throw cashControlError('CASH_COUNT_DRAFT_INVALID');
      }
      seen.add(key);
    }
    const draft = await this.repository.saveCountDraft(input.userId, {
      details: (input.details ?? []).map((d) => ({
        denomination: d.denomination,
        quantity: d.quantity,
      })),
      observations: input.observations?.slice(0, 500) ?? null,
    });
    if (!draft) {
      throw cashControlError('CASH_CUSTODY_DAY_NOT_OPEN');
    }
    return draft;
  }
}

/** Explicit "Reiniciar arqueo": discards the caller's draft of the current bank day. */
@Injectable()
export class DiscardCashCountDraftUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(actor: CustodyActor): Promise<{ discarded: true }> {
    assertCashCustodyPermission(actor.role, 'cash_custody.operate');
    await this.repository.deleteCountDraft(actor.userId);
    return { discarded: true };
  }
}

/** Unified history of caja ↔ Bodega transfers, filterable by kind, user, date and status. */
@Injectable()
export class ListCustodyTransfersUseCase {
  constructor(
    @Inject(CASH_CUSTODY_REPOSITORY)
    private readonly repository: CashCustodyRepository,
  ) {}

  async execute(input: {
    kind?: CustodyTransferKind;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: 'APLICADO' | 'ANULADO';
    page?: number;
    limit?: number;
    role: string;
  }): Promise<Paginated<CustodyTransferRow>> {
    assertCashCustodyPermission(input.role, 'cash_custody.view');
    if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findCustodyTransfers({
      kind: input.kind,
      userId: input.userId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      status: input.status,
      page: page(input.page),
      limit: limit(input.limit),
    });
  }
}
