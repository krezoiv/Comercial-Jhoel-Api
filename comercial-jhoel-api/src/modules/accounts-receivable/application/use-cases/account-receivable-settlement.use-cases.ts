import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY } from '../../domain/repositories/account-receivable-settlement.repository';
import type {
  AccountReceivableSettlementRepository,
  ChargeBalance,
  ChargePaymentRow,
  FindSettlementsOptions,
  PaginatedSettlements,
  SettlementItemData,
  SettlementPaymentMethod,
  SettlementWithDetails,
} from '../../domain/repositories/account-receivable-settlement.repository';
import { settlementError } from '../../domain/errors/account-receivable-settlement.errors';

/** Roles allowed to collect and void — the same ones that may "Registrar Abono" today. */
export const SETTLEMENT_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertSettlementRole(role: string): void {
  if (!(SETTLEMENT_ROLES as readonly string[]).includes(role)) {
    throw settlementError('AR_SETTLEMENT_FORBIDDEN');
  }
}

export interface ClientPendingCharges {
  clientId: string;
  clientName: string;
  /** Only accounts with something left to collect, oldest first. */
  charges: ChargeBalance[];
  totalPending: number;
}

/** "Consultar cuentas seleccionables de un cliente": active CARGOs with a pending amount > 0. */
@Injectable()
export class GetClientPendingChargesUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(clientId: string): Promise<ClientPendingCharges> {
    const clientName = await this.repository.findClientName(clientId);
    if (clientName === null) {
      throw settlementError('AR_SETTLEMENT_CLIENT_NOT_FOUND');
    }
    const charges = (
      await this.repository.findChargeBalances([clientId])
    ).filter((charge) => charge.pendingAmount > 0);
    return {
      clientId,
      clientName,
      charges,
      totalPending: round2(
        charges.reduce((sum, charge) => sum + charge.pendingAmount, 0),
      ),
    };
  }
}

export interface SettlementPreviewInput {
  clientId: string;
  items: SettlementItemData[];
  paymentMethod: SettlementPaymentMethod;
  bankId?: string | null;
}

export interface SettlementPreviewLine extends ChargeBalance {
  amountToPay: number;
  pendingAfter: number;
}

export interface SettlementPreview {
  clientId: string;
  clientName: string;
  paymentMethod: SettlementPaymentMethod;
  lines: SettlementPreviewLine[];
  total: number;
  /** Cash Kardex now / after (cash payments only). */
  cash: { current: number; after: number } | null;
  /** Selected account now / after (bank deposits only). */
  bank: {
    id: string;
    name: string;
    accountNumber: string | null;
    current: number;
    after: number;
  } | null;
}

/**
 * "Resumen de cuentas seleccionadas" before confirming: pendings, total and
 * resulting cash / bank balance, all read from PostgreSQL. Applies the same
 * rules as the write (same client, still pending, no partial in a batch) so
 * the modal shows the problem before the user confirms; the write re-checks
 * everything under lock anyway.
 */
@Injectable()
export class PreviewAccountReceivableSettlementUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(input: SettlementPreviewInput): Promise<SettlementPreview> {
    const ids = input.items.map((item) => item.accountReceivableId);
    if (ids.length === 0) {
      throw settlementError('AR_SETTLEMENT_ITEMS_REQUIRED');
    }
    if (new Set(ids).size !== ids.length) {
      throw settlementError('AR_SETTLEMENT_DUPLICATE_ITEM');
    }
    const clientName = await this.repository.findClientName(input.clientId);
    if (clientName === null) {
      throw settlementError('AR_SETTLEMENT_CLIENT_NOT_FOUND');
    }
    const charges = await this.repository.findChargeBalancesByIds(ids);
    const byId = new Map(charges.map((charge) => [charge.id, charge]));

    const lines: SettlementPreviewLine[] = input.items.map((item) => {
      const charge = byId.get(item.accountReceivableId);
      if (!charge) {
        throw settlementError('AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE');
      }
      if (charge.clientId !== input.clientId) {
        throw settlementError('AR_SETTLEMENT_MIXED_CLIENTS');
      }
      if (charge.pendingAmount <= 0) {
        throw settlementError('AR_SETTLEMENT_ALREADY_SETTLED');
      }
      let amount = charge.pendingAmount;
      if (item.amount !== undefined && item.amount !== null) {
        amount = round2(item.amount);
        if (ids.length > 1 && amount !== charge.pendingAmount) {
          throw settlementError('AR_SETTLEMENT_PARTIAL_NOT_ALLOWED');
        }
        if (!(amount > 0)) {
          throw settlementError('AR_SETTLEMENT_INVALID_AMOUNT');
        }
        if (amount > charge.pendingAmount) {
          throw settlementError('AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING');
        }
      }
      return {
        ...charge,
        amountToPay: amount,
        pendingAfter: round2(charge.pendingAmount - amount),
      };
    });
    const total = round2(
      lines.reduce((sum, line) => sum + line.amountToPay, 0),
    );

    let cash: SettlementPreview['cash'] = null;
    let bank: SettlementPreview['bank'] = null;
    if (input.paymentMethod === 'EFECTIVO') {
      const current = await this.repository.getCashBalance();
      cash = { current, after: round2(current + total) };
    } else {
      if (!input.bankId) {
        throw settlementError('AR_SETTLEMENT_BANK_REQUIRED');
      }
      const info = await this.repository.findBank(input.bankId);
      if (!info || !info.isActive) {
        throw settlementError('AR_SETTLEMENT_INVALID_BANK');
      }
      if (info.specialAccount === 'GUAYACAN') {
        throw settlementError('AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED');
      }
      bank = {
        id: info.id,
        name: info.name,
        accountNumber: info.accountNumber,
        current: info.balance,
        after: round2(info.balance + total),
      };
    }

    return {
      clientId: input.clientId,
      clientName,
      paymentMethod: input.paymentMethod,
      lines,
      total,
      cash,
      bank,
    };
  }
}

export interface SettleAccountsReceivableInput {
  clientId: string;
  items: SettlementItemData[];
  paymentMethod: SettlementPaymentMethod;
  bankId?: string | null;
  referenceNumber?: string | null;
  observations?: string | null;
  expectedTotal?: number | null;
  clientRequestId?: string | null;
  userId: string;
  role: string;
}

export interface SettlementResult {
  operation: SettlementWithDetails;
  /** Official cash balance after the operation (cash Kardex). */
  cashBalance: number;
}

/**
 * Cancels one or several accounts of ONE client in a single PostgreSQL
 * transaction (`settle_accounts_receivable`): pendings are computed there,
 * never taken from Angular; cash payments enter the cash Kardex (one
 * consolidated movement), bank deposits raise only the selected account.
 * `clientRequestId` (one per modal opening) makes a double click or a retry
 * return the same operation.
 */
@Injectable()
export class SettleAccountsReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(
    input: SettleAccountsReceivableInput,
  ): Promise<SettlementResult> {
    assertSettlementRole(input.role);
    if (input.items.length === 0) {
      throw settlementError('AR_SETTLEMENT_ITEMS_REQUIRED');
    }
    const isBank = input.paymentMethod === 'DEPOSITO_BANCARIO';
    if (isBank && !input.bankId) {
      throw settlementError('AR_SETTLEMENT_BANK_REQUIRED');
    }
    const id = await this.repository.settle({
      clientId: input.clientId,
      items: input.items.map((item) => ({
        accountReceivableId: item.accountReceivableId,
        amount:
          item.amount === undefined || item.amount === null
            ? null
            : round2(item.amount),
      })),
      paymentMethod: input.paymentMethod,
      bankId: isBank ? (input.bankId ?? null) : null,
      referenceNumber: isBank ? input.referenceNumber?.trim() || null : null,
      observations: input.observations?.trim() || null,
      expectedTotal:
        input.expectedTotal === undefined || input.expectedTotal === null
          ? null
          : round2(input.expectedTotal),
      userId: input.userId,
      idempotencyKey: `ARP:${input.clientRequestId ?? randomUUID()}`,
    });
    const [operation, cashBalance] = await Promise.all([
      this.repository.findById(id),
      this.repository.getCashBalance(),
    ]);
    if (!operation) {
      throw settlementError('AR_SETTLEMENT_NOT_FOUND');
    }
    return { operation, cashBalance };
  }
}

/**
 * Voids a collection (admin, mandatory reason): the consolidated ABONO is
 * deactivated (the accounts become pending again; a cash payment gets its
 * Kardex ANULACION through the existing trigger) and a bank deposit is
 * reversed with the bank ledger's own ANULACION. Nothing is deleted.
 */
@Injectable()
export class VoidAccountReceivableSettlementUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(input: {
    id: string;
    reason: string;
    userId: string;
    role: string;
  }): Promise<SettlementResult> {
    assertSettlementRole(input.role);
    const reason = input.reason?.trim() ?? '';
    if (reason.length < 5) {
      throw settlementError('AR_SETTLEMENT_REASON_REQUIRED');
    }
    await this.repository.void(input.id, input.userId, reason);
    const [operation, cashBalance] = await Promise.all([
      this.repository.findById(input.id),
      this.repository.getCashBalance(),
    ]);
    if (!operation) {
      throw settlementError('AR_SETTLEMENT_NOT_FOUND');
    }
    return { operation, cashBalance };
  }
}

/** History of collection operations (paginated, newest first). */
@Injectable()
export class ListAccountReceivableSettlementsUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  execute(
    options: Partial<FindSettlementsOptions>,
  ): Promise<PaginatedSettlements> {
    return this.repository.findAll({
      ...options,
      page: options.page ?? 1,
      limit: Math.min(options.limit ?? 20, 100),
    });
  }
}

/** Detail of one (possibly multi-account) collection, with every account it covered. */
@Injectable()
export class GetAccountReceivableSettlementUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(id: string): Promise<SettlementWithDetails> {
    const operation = await this.repository.findById(id);
    if (!operation) {
      throw settlementError('AR_SETTLEMENT_NOT_FOUND');
    }
    return operation;
  }
}

export interface ChargePaymentHistory {
  /** Current state of the account; `null` if it is not an active CARGO (ABONO or deactivated). */
  charge: ChargeBalance | null;
  payments: ChargePaymentRow[];
}

/** Payment history of ONE account (each payment it received, voided ones included). */
@Injectable()
export class GetChargePaymentHistoryUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)
    private readonly repository: AccountReceivableSettlementRepository,
  ) {}

  async execute(chargeId: string): Promise<ChargePaymentHistory> {
    const [charges, payments] = await Promise.all([
      this.repository.findChargeBalancesByIds([chargeId]),
      this.repository.findChargePayments(chargeId),
    ]);
    return { charge: charges[0] ?? null, payments };
  }
}
