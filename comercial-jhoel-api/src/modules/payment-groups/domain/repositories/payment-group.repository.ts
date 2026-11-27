import type {
  CashReservationSnapshot,
  PaymentGroupEventRow,
  PaymentGroupItemRow,
  PaymentGroupStatus,
  PaymentGroupSummaryRow,
  PaymentGroupTotals,
} from '../payment-group';

export const PAYMENT_GROUP_REPOSITORY = Symbol('PAYMENT_GROUP_REPOSITORY');

export interface PaymentGroupFilters {
  dateFrom?: string;
  dateTo?: string;
  transactionTypeId?: string;
  status?: PaymentGroupStatus;
  createdBy?: string;
  search?: string;
  page: number;
  limit: number;
}

/** One row: a transaction (Pago Varios) or a cuota (Génesis: amount + optional observation). */
export interface PaymentGroupItemData {
  expectedAmount: number;
  reference: string | null;
  creditNumber: string | null;
  observation: string | null;
}

export interface CreatePaymentGroupData {
  transactionTypeId: string;
  description: string;
  transactionBankId: string | null;
  bankAccountId: string | null;
  authorizedAmount: number;
  items: PaymentGroupItemData[];
  observations: string | null;
  userId: string;
  idempotencyKey: string;
}

/** Writes go through the SQL functions (locks, rules, history); reads through the derived views. */
export interface PaymentGroupRepository {
  findGroups(filters: PaymentGroupFilters): Promise<{
    items: PaymentGroupSummaryRow[];
    total: number;
    totals: PaymentGroupTotals;
  }>;
  findGroup(id: string): Promise<PaymentGroupSummaryRow | null>;
  findItems(groupId: string): Promise<PaymentGroupItemRow[]>;
  findEvents(groupId: string, itemId?: string): Promise<PaymentGroupEventRow[]>;
  getCashSnapshot(): Promise<CashReservationSnapshot>;
  create(data: CreatePaymentGroupData): Promise<string>;
  registerDelivery(
    groupId: string,
    itemId: string,
    amount: number,
    note: string | null,
    userId: string,
    idempotencyKey: string,
  ): Promise<string>;
  markNoPayment(
    groupId: string,
    itemId: string,
    note: string,
    userId: string,
  ): Promise<void>;
  addNote(
    groupId: string,
    itemId: string | null,
    note: string,
    userId: string,
  ): Promise<void>;
  updateItem(
    groupId: string,
    itemId: string,
    data: {
      expectedAmount?: number;
      reference?: string | null;
      note?: string | null;
    },
    userId: string,
  ): Promise<void>;
  resolveItem(
    groupId: string,
    itemId: string,
    resolution: string,
    release: boolean,
    userId: string,
  ): Promise<void>;
  voidItem(
    groupId: string,
    itemId: string,
    reason: string,
    moneyReturned: boolean,
    userId: string,
  ): Promise<void>;
  close(groupId: string, note: string | null, userId: string): Promise<void>;
  voidGroup(groupId: string, reason: string, userId: string): Promise<void>;
  /** Replaces name, total and cuotas of a group pending approval (history keeps before/after). */
  updatePending(
    groupId: string,
    data: {
      description: string;
      authorizedAmount: number;
      items: PaymentGroupItemData[];
      note: string | null;
    },
    userId: string,
  ): Promise<void>;
  /** Books every cuota at once and closes the group; idempotent. */
  approve(
    groupId: string,
    expectedAmount: number,
    expectedCount: number,
    userId: string,
    idempotencyKey: string,
  ): Promise<void>;
}
