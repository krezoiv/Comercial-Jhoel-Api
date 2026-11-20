/**
 * Customer account statement of Listas Escolares (Caja de Listas expansion,
 * 2026-11-19). A customer is every list with the same phone digits (owner
 * decision). Nothing here is stored: the chronological ledger is rebuilt only
 * from real records — the list history (`CREADA`, `EDITADA` with
 * totalBefore/totalAfter, leaving `BORRADOR`, `CANCELADA`) and the payment
 * rows (anticipos, abonos, voids, refunds) — and its final balance is checked
 * against the official balance (Σ total − paid of the lists that are not
 * cancelled). A mismatch is reported, never hidden or "fixed".
 */

import type { CustomerAccountStatus } from './repositories/school-cash-box.repository';

/** SOLVENTE: nothing owed · ABONANDO: paid something, still owes · PENDIENTE: owes and never paid · CANCELADO: only cancelled lists. */
export function customerAccountStatus(totals: {
  activeLists: number;
  paid: number;
  balance: number;
}): CustomerAccountStatus {
  if (totals.activeLists === 0) {
    return 'CANCELADO';
  }
  if (totals.balance <= 0) {
    return 'SOLVENTE';
  }
  return totals.paid > 0 ? 'ABONANDO' : 'PENDIENTE';
}

/** Payment of a list as shown to people: "Liquidación" is the one that left the list at zero. */
export function paymentTypeLabel(kind: string, balanceAfter: number): string {
  switch (kind) {
    case 'ANTICIPO':
      return balanceAfter === 0 ? 'Pago total' : 'Pago inicial';
    case 'ABONO':
      return balanceAfter === 0 ? 'Liquidación' : 'Abono';
    case 'DEVOLUCION':
      return 'Devolución';
    case 'ANULACION':
      return 'Anulación de pago';
    default:
      return kind;
  }
}

export interface LedgerListInput {
  id: string;
  quotationNumber: string;
  studentName: string | null;
  grade: string;
  status: string;
  total: number;
  paid: number;
}

export interface LedgerHistoryInput {
  /** Monotonic id of the history row (tie-break). */
  seq: number;
  quotationId: string;
  action: string;
  fromStatus: string | null;
  toStatus: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface LedgerPaymentInput {
  seq: number;
  id: string;
  quotationId: string;
  receiptNumber: string;
  kind: string;
  amount: number;
  paymentMethodLabel: string;
  bankName: string | null;
  reference: string | null;
  balanceAfter: number;
  /** Receipt of the payment an ANULACION reverses. */
  reversedReceipt: string | null;
  receivedAt: string;
}

export type LedgerRowKind =
  | 'SALDO_INICIAL'
  | 'CARGO_LISTA'
  | 'MODIFICACION'
  | 'PAGO'
  | 'ANULACION_PAGO'
  | 'DEVOLUCION'
  | 'CANCELACION';

export interface LedgerRow {
  at: string;
  kind: LedgerRowKind;
  description: string;
  quotationNumber: string | null;
  studentName: string | null;
  reference: string | null;
  /** Increases what the customer owes. */
  charge: number;
  /** Decreases what the customer owes. */
  credit: number;
  balance: number;
}

export interface CustomerLedger {
  opening: number;
  rows: LedgerRow[];
  totalCharges: number;
  totalCredits: number;
  closing: number;
  /** Official balance: Σ (total − paid) of the lists that are not cancelled. */
  officialBalance: number;
  /** Whether the full ledger ends exactly at the official balance. */
  consistent: boolean;
}

const PRIORITY: Record<LedgerRowKind, number> = {
  SALDO_INICIAL: -1,
  CARGO_LISTA: 0,
  MODIFICACION: 1,
  PAGO: 2,
  ANULACION_PAGO: 3,
  DEVOLUCION: 4,
  CANCELACION: 5,
};

const cents = (value: number) => Math.round(value * 100);
const money = (value: number) => Math.round(value * 100) / 100;

/** `yyyy-MM-dd` of an instant in Guatemala. */
export function guatemalaDay(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

interface Event {
  at: string;
  seq: number;
  kind: LedgerRowKind;
  description: string;
  quotationNumber: string | null;
  studentName: string | null;
  reference: string | null;
  /** Signed in cents: + increases the debt. */
  delta: number;
}

function listLabel(list: LedgerListInput): string {
  return [list.quotationNumber, list.studentName, list.grade]
    .filter(Boolean)
    .join(' · ');
}

function listEvents(
  list: LedgerListInput,
  history: LedgerHistoryInput[],
): Event[] {
  const events: Event[] = [];
  let draft = false;
  let charged = false;
  let total = 0;
  const base = (
    row: LedgerHistoryInput,
    kind: LedgerRowKind,
    description: string,
    delta: number,
  ): Event => ({
    at: row.createdAt,
    seq: row.seq,
    kind,
    description,
    quotationNumber: list.quotationNumber,
    studentName: list.studentName,
    reference: null,
    delta,
  });
  for (const row of [...history].sort((a, b) => a.seq - b.seq)) {
    if (row.action === 'CREADA') {
      total = cents(Number(row.details.total ?? 0) || 0);
      draft = row.toStatus === 'BORRADOR';
      if (!draft) {
        events.push(
          base(row, 'CARGO_LISTA', `Lista escolar ${listLabel(list)}`, total),
        );
        charged = true;
      }
    } else if (row.action === 'EDITADA') {
      const before = cents(Number(row.details.totalBefore ?? total / 100) || 0);
      const after = cents(Number(row.details.totalAfter ?? before / 100) || 0);
      if (charged && after !== before) {
        events.push(
          base(
            row,
            'MODIFICACION',
            `Modificación de la lista ${list.quotationNumber}`,
            after - before,
          ),
        );
      }
      total = after;
    } else if (row.action === 'CANCELADA') {
      if (charged) {
        events.push(
          base(
            row,
            'CANCELACION',
            `Cancelación de la lista ${list.quotationNumber}`,
            -total,
          ),
        );
        charged = false;
      }
      draft = false;
    } else if (
      draft &&
      row.fromStatus === 'BORRADOR' &&
      row.toStatus &&
      row.toStatus !== 'BORRADOR'
    ) {
      // A draft becomes a sale when it is confirmed: that is when it is owed.
      draft = false;
      events.push(
        base(
          row,
          'CARGO_LISTA',
          `Lista escolar ${listLabel(list)} (confirmada)`,
          total,
        ),
      );
      charged = true;
    }
  }
  return events;
}

function paymentEvent(
  payment: LedgerPaymentInput,
  list: LedgerListInput | undefined,
): Event {
  const common = {
    at: payment.receivedAt,
    seq: payment.seq,
    quotationNumber: list?.quotationNumber ?? null,
    studentName: list?.studentName ?? null,
    reference: payment.reference,
  };
  const where = payment.bankName
    ? `${payment.paymentMethodLabel} · ${payment.bankName}`
    : payment.paymentMethodLabel;
  switch (payment.kind) {
    case 'ANULACION':
      return {
        ...common,
        kind: 'ANULACION_PAGO',
        description:
          `Anulación del pago ${payment.reversedReceipt ?? ''}`.trim(),
        delta: cents(payment.amount),
      };
    case 'DEVOLUCION':
      return {
        ...common,
        kind: 'DEVOLUCION',
        description: `Devolución al cliente (${where}) · ${payment.receiptNumber}`,
        delta: cents(payment.amount),
      };
    default:
      return {
        ...common,
        kind: 'PAGO',
        description: `${paymentTypeLabel(payment.kind, payment.balanceAfter)} (${where}) · ${payment.receiptNumber}`,
        delta: -cents(payment.amount),
      };
  }
}

/**
 * Chronological statement (charges, payments, voids, cancellations and
 * refunds) with a running balance. With `range`, movements before `from`
 * become the opening balance and those after `to` are left out.
 */
export function buildCustomerLedger(
  lists: LedgerListInput[],
  history: LedgerHistoryInput[],
  payments: LedgerPaymentInput[],
  range: { from?: string; to?: string } = {},
): CustomerLedger {
  const byList = new Map(lists.map((list) => [list.id, list]));
  const events: Event[] = [
    ...lists.flatMap((list) =>
      listEvents(
        list,
        history.filter((h) => h.quotationId === list.id),
      ),
    ),
    ...payments.map((payment) =>
      paymentEvent(payment, byList.get(payment.quotationId)),
    ),
  ].sort(
    (a, b) =>
      a.at.localeCompare(b.at) ||
      PRIORITY[a.kind] - PRIORITY[b.kind] ||
      a.seq - b.seq,
  );

  const official = lists
    .filter((list) => list.status !== 'CANCELADA' && list.status !== 'BORRADOR')
    .reduce((sum, list) => sum + cents(list.total) - cents(list.paid), 0);
  const fullClosing = events.reduce((sum, event) => sum + event.delta, 0);

  let running = 0;
  let opening = 0;
  let charges = 0;
  let credits = 0;
  const rows: LedgerRow[] = [];
  for (const event of events) {
    const day = guatemalaDay(event.at);
    if (range.to && day > range.to) {
      break;
    }
    running += event.delta;
    if (range.from && day < range.from) {
      opening = running;
      continue;
    }
    if (event.delta > 0) {
      charges += event.delta;
    } else {
      credits -= event.delta;
    }
    rows.push({
      at: event.at,
      kind: event.kind,
      description: event.description,
      quotationNumber: event.quotationNumber,
      studentName: event.studentName,
      reference: event.reference,
      charge: event.delta > 0 ? money(event.delta / 100) : 0,
      credit: event.delta < 0 ? money(-event.delta / 100) : 0,
      balance: money(running / 100),
    });
  }
  if (range.from && opening !== 0) {
    rows.unshift({
      at: `${range.from}T06:00:00.000Z`,
      kind: 'SALDO_INICIAL',
      description: 'Saldo anterior al período',
      quotationNumber: null,
      studentName: null,
      reference: null,
      charge: 0,
      credit: 0,
      balance: money(opening / 100),
    });
  }
  return {
    opening: money(opening / 100),
    rows,
    totalCharges: money(charges / 100),
    totalCredits: money(credits / 100),
    closing: money(running / 100),
    officialBalance: money(official / 100),
    consistent: fullClosing === official,
  };
}
