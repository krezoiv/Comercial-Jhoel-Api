import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../../banks/domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { todayIsoDate } from '../../../bank-deposits/application/utils/today-iso-date';
import {
  CashReservationSnapshot,
  PaymentGroupDetail,
  PaymentGroupEventRow,
  PaymentGroupStatus,
  PaymentGroupSummaryRow,
  PaymentGroupTotals,
  approvalCheckOf,
  closeCheckOf,
  paymentGroupError,
} from '../../domain/payment-group';
import { PAYMENT_GROUP_REPOSITORY } from '../../domain/repositories/payment-group.repository';
import type {
  PaymentGroupItemData,
  PaymentGroupRepository,
} from '../../domain/repositories/payment-group.repository';

/** Who acts: release, void and close are admin-only (owner decision); the rest is open to Transaccionar users. */
export interface PaymentGroupActor {
  userId: string;
  role: string;
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

const isAdmin = (actor: PaymentGroupActor): boolean =>
  ADMIN_ROLES.includes(actor.role);

function requireAdmin(
  actor: PaymentGroupActor,
  code = 'PAYMENT_GROUP_FORBIDDEN',
): void {
  if (!isAdmin(actor)) {
    throw paymentGroupError(code);
  }
}

/** One row of the request: a transaction (amount + beneficiary), or a Génesis cuota (amount + optional observation). */
export interface PaymentGroupItemInput {
  expectedAmount: number;
  reference?: string | null;
  creditNumber?: string | null;
  observation?: string | null;
}

const cleanText = (value: string | null | undefined): string | null =>
  value?.trim().replace(/\s+/g, ' ') || null;

function itemData(items: PaymentGroupItemInput[]): PaymentGroupItemData[] {
  return items.map((item) => ({
    expectedAmount: item.expectedAmount,
    reference: cleanText(item.reference),
    creditNumber: cleanText(item.creditNumber),
    observation: cleanText(item.observation),
  }));
}

/** The declared number of cuotas must be exactly the rows sent (checked again by the database for the total). */
function requireDeclaredCount(
  items: PaymentGroupItemInput[],
  declaredCount: number | undefined,
): void {
  if (declaredCount !== undefined && declaredCount !== items.length) {
    throw paymentGroupError(
      'PAYMENT_GROUP_COUNT_MISMATCH',
      `${items.length}/${declaredCount}`,
    );
  }
}

/** Trimmed, single-spaced text, or throws when shorter than `min`. */
function noteText(
  value: string | null | undefined,
  min: number,
): string | null {
  const text = (value ?? '').trim().replace(/\s+/g, ' ');
  if (text.length < min) {
    throw paymentGroupError('PAYMENT_GROUP_NOTE_REQUIRED', String(min));
  }
  return text || null;
}

async function loadDetail(
  repository: PaymentGroupRepository,
  id: string,
): Promise<PaymentGroupDetail> {
  const [group, items, cash] = await Promise.all([
    repository.findGroup(id),
    repository.findItems(id),
    repository.getCashSnapshot(),
  ]);
  if (!group) {
    throw paymentGroupError('PAYMENT_GROUP_NOT_FOUND');
  }
  return {
    group,
    items,
    cash,
    closeCheck: closeCheckOf(group),
    approvalCheck: approvalCheckOf(group, items),
  };
}

/** Money only moves on an open business day (same Agentes Bancarios cycle as Transaccionar). */
async function requireOpenDay(days: DayOpeningRepository): Promise<void> {
  const today = todayIsoDate();
  const day = await days.findByDate(today);
  if (!day) {
    throw paymentGroupError('PAYMENT_GROUP_DAY_NOT_OPEN', today);
  }
  if (day.isClosed) {
    throw paymentGroupError('PAYMENT_GROUP_DAY_CLOSED', today);
  }
}

export interface ListPaymentGroupsInput {
  dateFrom?: string;
  dateTo?: string;
  transactionTypeId?: string;
  status?: PaymentGroupStatus;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaymentGroupListOutput {
  items: PaymentGroupSummaryRow[];
  total: number;
  page: number;
  limit: number;
  summary: PaymentGroupTotals;
  cash: CashReservationSnapshot;
}

@Injectable()
export class ListPaymentGroupsUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    input: ListPaymentGroupsInput,
  ): Promise<PaymentGroupListOutput> {
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const [result, cash] = await Promise.all([
      this.repository.findGroups({ ...input, page, limit }),
      this.repository.getCashSnapshot(),
    ]);
    return {
      items: result.items,
      total: result.total,
      page,
      limit,
      summary: result.totals,
      cash,
    };
  }
}

@Injectable()
export class GetPaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  execute(id: string): Promise<PaymentGroupDetail> {
    return loadDetail(this.repository, id);
  }
}

@Injectable()
export class GetPaymentGroupHistoryUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(id: string, itemId?: string): Promise<PaymentGroupEventRow[]> {
    if (!(await this.repository.findGroup(id))) {
      throw paymentGroupError('PAYMENT_GROUP_NOT_FOUND');
    }
    return this.repository.findEvents(id, itemId);
  }
}

export interface CreatePaymentGroupInput {
  transactionTypeId: string;
  description: string;
  transactionBankId?: string | null;
  bankAccountId?: string | null;
  authorizedAmount: number;
  /** Declared number of cuotas / transactions: must equal the rows sent. */
  declaredCount?: number;
  items: PaymentGroupItemInput[];
  observations?: string | null;
  clientRequestId: string;
}

/**
 * Creates the group and its N transactions. For a type that takes cash out
 * the authorized amount is RESERVED (no cash movement; the available cash for
 * other operations drops). A Génesis group is saved PENDIENTE DE APROBACIÓN:
 * nothing moves until an admin approves it, and its cuotas must add up to the
 * declared total exactly. The database re-validates everything under the Caja
 * lock — including that the reservation fits the available cash.
 */
@Injectable()
export class CreatePaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly days: DayOpeningRepository,
  ) {}

  async execute(
    input: CreatePaymentGroupInput,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    requireDeclaredCount(input.items, input.declaredCount);
    await requireOpenDay(this.days);
    const id = await this.repository.create({
      transactionTypeId: input.transactionTypeId,
      description: input.description,
      transactionBankId: input.transactionBankId ?? null,
      bankAccountId: input.bankAccountId ?? null,
      authorizedAmount: input.authorizedAmount,
      items: itemData(input.items),
      observations: input.observations?.trim() || null,
      userId: actor.userId,
      idempotencyKey: `PG:${input.clientRequestId}`,
    });
    return loadDetail(this.repository, id);
  }
}

export interface RegisterDeliveryInput {
  amount: number;
  note?: string | null;
  clientRequestId: string;
}

/**
 * Confirms a payment (complete, partial, or the rest of a partial): registers
 * the real Transaccionar operation for exactly the amount handed over / received,
 * linked to the transaction. Idempotent by `clientRequestId`.
 */
@Injectable()
export class RegisterPaymentGroupDeliveryUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly days: DayOpeningRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string,
    input: RegisterDeliveryInput,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    await requireOpenDay(this.days);
    await this.repository.registerDelivery(
      groupId,
      itemId,
      input.amount,
      noteText(input.note, 0),
      actor.userId,
      `PGD:${input.clientRequestId}`,
    );
    return loadDetail(this.repository, groupId);
  }
}

@Injectable()
export class MarkPaymentGroupNoPaymentUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string,
    note: string,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    await this.repository.markNoPayment(
      groupId,
      itemId,
      noteText(note, 5)!,
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

@Injectable()
export class AddPaymentGroupNoteUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string | null,
    note: string,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    await this.repository.addNote(
      groupId,
      itemId,
      noteText(note, 3)!,
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

@Injectable()
export class UpdatePaymentGroupItemUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string,
    input: {
      expectedAmount?: number;
      reference?: string | null;
      note?: string | null;
    },
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    await this.repository.updateItem(
      groupId,
      itemId,
      {
        expectedAmount: input.expectedAmount,
        reference:
          input.reference === undefined
            ? undefined
            : input.reference?.trim() || null,
        note: noteText(input.note, 0),
      },
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

/** Documents how a partial / no-payment transaction ended; releasing its remaining reservation is admin-only. */
@Injectable()
export class ResolvePaymentGroupItemUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string,
    input: { resolution: string; release: boolean },
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    if (input.release) {
      requireAdmin(actor);
    }
    await this.repository.resolveItem(
      groupId,
      itemId,
      noteText(input.resolution, 5)!,
      input.release,
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

/**
 * Voids a transaction (admin). Unpaid: only releases its reservation. Paid:
 * only when the money really came back — its operations are voided with the
 * existing reversal; never a fictitious entry.
 */
@Injectable()
export class VoidPaymentGroupItemUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    itemId: string,
    input: { reason: string; moneyReturned: boolean },
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    requireAdmin(actor);
    await this.repository.voidItem(
      groupId,
      itemId,
      noteText(input.reason, 5)!,
      input.moneyReturned,
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

/** Closes and reconciles (admin): nothing pending, every difference documented; releases what was not used. */
@Injectable()
export class ClosePaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    note: string | null | undefined,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    requireAdmin(actor);
    await this.repository.close(groupId, noteText(note, 0), actor.userId);
    return loadDetail(this.repository, groupId);
  }
}

/** Voids a whole group without payments (admin): releases all its reservation. */
@Injectable()
export class VoidPaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    reason: string,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    requireAdmin(actor);
    await this.repository.voidGroup(
      groupId,
      noteText(reason, 5)!,
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

export interface UpdatePendingPaymentGroupInput {
  description: string;
  authorizedAmount: number;
  declaredCount: number;
  items: PaymentGroupItemInput[];
  note?: string | null;
}

/**
 * Corrects a Génesis group still pending approval: name, total and the whole
 * cuota list (add, edit, remove). Only its creator or an admin; nothing was
 * booked yet, and the history keeps the group before and after.
 */
@Injectable()
export class UpdatePendingPaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
  ) {}

  async execute(
    groupId: string,
    input: UpdatePendingPaymentGroupInput,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    const group = await this.repository.findGroup(groupId);
    if (!group) {
      throw paymentGroupError('PAYMENT_GROUP_NOT_FOUND');
    }
    if (!group.requiresApproval) {
      throw paymentGroupError('PAYMENT_GROUP_NOT_EDITABLE');
    }
    if (group.createdBy !== actor.userId && !isAdmin(actor)) {
      throw paymentGroupError('PAYMENT_GROUP_EDIT_FORBIDDEN');
    }
    requireDeclaredCount(input.items, input.declaredCount);
    await this.repository.updatePending(
      groupId,
      {
        description: input.description,
        authorizedAmount: input.authorizedAmount,
        items: itemData(input.items),
        note: noteText(input.note, 0),
      },
      actor.userId,
    );
    return loadDetail(this.repository, groupId);
  }
}

export interface ApprovePaymentGroupInput {
  /** Total and number of cuotas the admin reviewed: approval fails if the group changed meanwhile. */
  expectedAmount: number;
  expectedCount: number;
  clientRequestId: string;
}

/**
 * Approves a Génesis group (admin): books every cuota as its own real
 * operation — Caja, Génesis line, Kardex, Estado de Cuenta and transaction
 * count move exactly as individual payments — and closes the group, all in one
 * database transaction. Idempotent: an approved group is never booked twice.
 */
@Injectable()
export class ApprovePaymentGroupUseCase {
  constructor(
    @Inject(PAYMENT_GROUP_REPOSITORY)
    private readonly repository: PaymentGroupRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly days: DayOpeningRepository,
  ) {}

  async execute(
    groupId: string,
    input: ApprovePaymentGroupInput,
    actor: PaymentGroupActor,
  ): Promise<PaymentGroupDetail> {
    requireAdmin(actor, 'PAYMENT_GROUP_APPROVE_FORBIDDEN');
    await requireOpenDay(this.days);
    await this.repository.approve(
      groupId,
      input.expectedAmount,
      input.expectedCount,
      actor.userId,
      `PGA:${input.clientRequestId}`,
    );
    return loadDetail(this.repository, groupId);
  }
}

export const PAYMENT_GROUP_USE_CASES = [
  ListPaymentGroupsUseCase,
  GetPaymentGroupUseCase,
  GetPaymentGroupHistoryUseCase,
  CreatePaymentGroupUseCase,
  RegisterPaymentGroupDeliveryUseCase,
  MarkPaymentGroupNoPaymentUseCase,
  AddPaymentGroupNoteUseCase,
  UpdatePaymentGroupItemUseCase,
  ResolvePaymentGroupItemUseCase,
  VoidPaymentGroupItemUseCase,
  ClosePaymentGroupUseCase,
  VoidPaymentGroupUseCase,
  UpdatePendingPaymentGroupUseCase,
  ApprovePaymentGroupUseCase,
];
