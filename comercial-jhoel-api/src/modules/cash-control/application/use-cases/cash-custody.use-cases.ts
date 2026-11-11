import { Inject, Injectable } from '@nestjs/common';
import { CASH_CUSTODY_REPOSITORY } from '../../domain/repositories/cash-custody.repository';
import type {
  CashCountResult,
  CashCountRow,
  CashCustodyRepository,
  CashCustodySnapshot,
  Paginated,
  WarehouseMovementRow,
  WarehouseTransferRow,
} from '../../domain/repositories/cash-custody.repository';
import { assertCashCustodyPermission } from '../../domain/policies/cash-control.policy';
import { cashControlError } from '../../domain/errors/cash-control.errors';

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
 * "Entrega de Efectivo a Bodega": one atomic SQL call moves the cash from the
 * caja Kardex to the Bodega Kardex (same amount, same reference). Without a
 * breakdown it requires `cash_custody.authorize` (business policy).
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
    const details = nonZero(input.details);
    if (details.length === 0) {
      assertCashCustodyPermission(input.role, 'cash_custody.authorize');
    }
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
 * "Arqueo de Caja": stores the count as a photograph (theoretical caja and
 * Bodega read under their locks). It never touches the Kardex; a difference
 * stays recorded as FALTANTE/SOBRANTE. With `replacesId` it is an audited
 * correction (admin + reason) that keeps the original photograph.
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
      warehouseCounted?: number | null;
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
      warehouseCounted: input.warehouseCounted ?? null,
      userId: input.userId,
      idempotencyKey: `ARQ:${input.clientRequestId}`,
      replacesId: input.replacesId ?? null,
      correctionReason: input.correctionReason?.trim() || null,
    });
    const count = await this.repository.findCountById(id);
    if (!count) {
      throw cashControlError('CASH_COUNT_NOT_FOUND');
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
