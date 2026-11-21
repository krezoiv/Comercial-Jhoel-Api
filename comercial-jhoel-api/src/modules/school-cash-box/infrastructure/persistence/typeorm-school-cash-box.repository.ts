import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  AdjustmentInput,
  CashUser,
  CustomerAccountStatus,
  CustomerDetailRaw,
  CustomerFilters,
  CustomerPage,
  CustomerPaymentRow,
  CustomerRow,
  PaymentFilters,
  PaymentPage,
  SummaryPeriod,
  CountInput,
  DateRangeFilters,
  ExitInput,
  MovementFilters,
  Page,
  ReceiptFilters,
  ReportRecord,
  SchoolCashBoxRepository,
  SchoolCashCountRow,
  SchoolCashDirection,
  SchoolCashExitDestination,
  SchoolCashExitRow,
  SchoolCashMovementRow,
  SchoolCashMovementType,
  SchoolCashReceiptRow,
  SchoolCashReceiptStatus,
  SchoolCashSummaryRow,
  SchoolCashTransferRow,
  TransferInput,
} from '../../domain/repositories/school-cash-box.repository';
import {
  schoolListError,
  schoolListErrorFromMessage,
} from '../../../school-lists/domain/errors/school-list.errors';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';
import { isAcceptedSchoolStatus } from '../../../school-lists/domain/repositories/school-list.repository';

type SqlRow = Record<string, unknown>;

const GT = `'America/Guatemala'`;
const USER_NAME = (alias: string) =>
  `COALESCE(NULLIF(${alias}.name, ''), ${alias}.username, '—')`;

function text(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
    ? value.toString()
    : JSON.stringify(value);
}
function textOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}
function num(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

const MOVEMENT_SELECT = `
  SELECT m.*, m.business_date::text AS business_day, b.name AS bank_name, t.transfer_number, e.exit_number,
         o.movement_number AS reversal_of_number, ${USER_NAME('u')} AS user_name, ${USER_NAME('ru')} AS reversed_by_name
    FROM school_cash_movements m
    JOIN users u ON u.id = m.user_id
    LEFT JOIN users ru ON ru.id = m.reversed_by
    LEFT JOIN banks b ON b.id = m.bank_id
    LEFT JOIN school_cash_transfers t ON t.id = m.transfer_id
    LEFT JOIN school_cash_exits e ON e.id = m.exit_id
    LEFT JOIN school_cash_movements o ON o.id = m.reversal_of_id`;

function toMovement(row: SqlRow): SchoolCashMovementRow {
  const direction = text(row.direction) as SchoolCashDirection;
  const amount = num(row.amount);
  return {
    id: text(row.id),
    sequence: num(row.sequence),
    movementNumber: text(row.movement_number),
    movementType: text(row.movement_type) as SchoolCashMovementType,
    direction,
    amount,
    cashEffect: direction === 'IN' ? amount : direction === 'OUT' ? -amount : 0,
    balanceBefore: num(row.balance_before),
    balanceAfter: num(row.balance_after),
    paymentMethod: textOrNull(row.payment_method),
    quotationId: textOrNull(row.quotation_id),
    quotationNumber: textOrNull(row.quotation_number),
    customerName: textOrNull(row.customer_name),
    paymentId: textOrNull(row.payment_id),
    receiptNumber: textOrNull(row.receipt_number),
    bankId: textOrNull(row.bank_id),
    bankName: textOrNull(row.bank_name),
    transferId: textOrNull(row.transfer_id),
    transferNumber: textOrNull(row.transfer_number),
    exitId: textOrNull(row.exit_id),
    exitNumber: textOrNull(row.exit_number),
    description: text(row.description),
    reference: textOrNull(row.reference),
    observations: textOrNull(row.observations),
    businessDate: text(row.business_day),
    status: text(row.status) as 'APLICADO' | 'REVERTIDO',
    reversalOfId: textOrNull(row.reversal_of_id),
    reversalOfNumber: textOrNull(row.reversal_of_number),
    reversedAt: textOrNull(row.reversed_at),
    reversedByName: textOrNull(row.reversed_by_name),
    reverseReason: textOrNull(row.reverse_reason),
    userName: text(row.user_name),
    createdAt: text(row.created_at),
  };
}

const RECEIPT_SELECT = `
  SELECT r.*, b.name AS bank_name, ${USER_NAME('u')} AS user_name
    FROM school_cash_pending_receipts r
    JOIN banks b ON b.id = r.bank_id
    JOIN users u ON u.id = r.user_id`;

function toReceipt(row: SqlRow): SchoolCashReceiptRow {
  return {
    id: text(row.id),
    movementNumber: text(row.movement_number),
    paymentId: textOrNull(row.payment_id),
    receiptNumber: textOrNull(row.receipt_number),
    quotationId: textOrNull(row.quotation_id),
    quotationNumber: textOrNull(row.quotation_number),
    customerName: textOrNull(row.customer_name),
    paymentMethod: textOrNull(row.payment_method),
    bankId: text(row.bank_id),
    bankName: text(row.bank_name),
    reference: textOrNull(row.reference),
    amount: num(row.amount),
    transferred: num(row.transferred),
    refunded: num(row.refunded),
    pending: num(row.pending),
    transferStatus: text(row.transfer_status) as SchoolCashReceiptStatus,
    receivedAt: text(row.created_at),
    userName: text(row.user_name),
  };
}

const TRANSFER_SELECT = `
  SELECT t.*, t.business_date::text AS business_day, b.name AS bank_name,
         ${USER_NAME('u')} AS user_name, ${USER_NAME('vu')} AS voided_by_name,
         COALESCE((SELECT jsonb_agg(jsonb_build_object(
                    'receiptId', a.receipt_movement_id, 'receiptNumber', m.receipt_number,
                    'quotationNumber', m.quotation_number, 'customerName', m.customer_name,
                    'amount', a.amount) ORDER BY m.sequence)
                     FROM school_cash_receipt_applications a
                     JOIN school_cash_movements m ON m.id = a.receipt_movement_id
                    WHERE a.transfer_id = t.id), '[]'::jsonb) AS items
    FROM school_cash_transfers t
    JOIN banks b ON b.id = t.bank_id
    JOIN users u ON u.id = t.user_id
    LEFT JOIN users vu ON vu.id = t.voided_by`;

function toTransfer(row: SqlRow): SchoolCashTransferRow {
  const items = (row.items ?? []) as Array<Record<string, unknown>>;
  return {
    id: text(row.id),
    transferNumber: text(row.transfer_number),
    bankId: text(row.bank_id),
    bankName: text(row.bank_name),
    amount: num(row.amount),
    businessDate: text(row.business_day),
    reference: textOrNull(row.reference),
    observations: textOrNull(row.observations),
    status: text(row.status) as 'APLICADO' | 'ANULADO',
    userName: text(row.user_name),
    createdAt: text(row.created_at),
    voidedAt: textOrNull(row.voided_at),
    voidedByName: textOrNull(row.voided_by_name),
    voidReason: textOrNull(row.void_reason),
    items: items.map((item) => ({
      receiptId: text(item.receiptId),
      receiptNumber: textOrNull(item.receiptNumber),
      quotationNumber: textOrNull(item.quotationNumber),
      customerName: textOrNull(item.customerName),
      amount: num(item.amount),
    })),
  };
}

const EXIT_SELECT = `
  SELECT e.*, e.business_date::text AS business_day, b.name AS bank_name,
         ${USER_NAME('u')} AS authorized_by_name, ${USER_NAME('vu')} AS voided_by_name
    FROM school_cash_exits e
    JOIN users u ON u.id = e.authorized_by
    LEFT JOIN users vu ON vu.id = e.voided_by
    LEFT JOIN banks b ON b.id = e.bank_id`;

function toExit(row: SqlRow): SchoolCashExitRow {
  return {
    id: text(row.id),
    exitNumber: text(row.exit_number),
    amount: num(row.amount),
    destination: text(row.destination) as SchoolCashExitDestination,
    bankId: textOrNull(row.bank_id),
    bankName: textOrNull(row.bank_name),
    recipientName: textOrNull(row.recipient_name),
    reason: text(row.reason),
    reference: textOrNull(row.reference),
    businessDate: text(row.business_day),
    status: text(row.status) as 'APLICADO' | 'ANULADO',
    authorizedByName: text(row.authorized_by_name),
    createdAt: text(row.created_at),
    voidedAt: textOrNull(row.voided_at),
    voidedByName: textOrNull(row.voided_by_name),
    voidReason: textOrNull(row.void_reason),
  };
}

const COUNT_SELECT = `
  SELECT c.*, c.business_date::text AS business_day, ${USER_NAME('u')} AS user_name,
         m.movement_number AS last_movement_number,
         COALESCE((SELECT jsonb_agg(jsonb_build_object('denomination', d.denomination, 'quantity', d.quantity,
                                                       'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                     FROM school_cash_count_details d WHERE d.count_id = c.id), '[]'::jsonb) AS details
    FROM school_cash_counts c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN school_cash_movements m ON m.id = c.last_movement_id`;

function toCount(row: SqlRow): SchoolCashCountRow {
  const details = (row.details ?? []) as Array<Record<string, unknown>>;
  return {
    id: text(row.id),
    countNumber: text(row.count_number),
    theoreticalBalance: num(row.theoretical_balance),
    countedTotal: num(row.counted_total),
    difference: num(row.difference),
    status: text(row.status) as 'CUADRADO' | 'FALTANTE' | 'SOBRANTE',
    lastMovementNumber: textOrNull(row.last_movement_number),
    observations: textOrNull(row.observations),
    businessDate: text(row.business_day),
    userName: text(row.user_name),
    createdAt: text(row.created_at),
    details: details.map((d) => ({
      denomination: num(d.denomination),
      quantity: num(d.quantity),
      subtotal: num(d.subtotal),
    })),
  };
}

/** `WHERE` fragment + params for an optional Guatemala date range on a timestamptz column. */
function rangeOnInstant(
  column: string,
  filters: { dateFrom?: string; dateTo?: string },
  params: unknown[],
): string[] {
  const where: string[] = [];
  if (filters.dateFrom) {
    params.push(filters.dateFrom);
    where.push(
      `(${column} AT TIME ZONE ${GT})::date >= $${params.length}::date`,
    );
  }
  if (filters.dateTo) {
    params.push(filters.dateTo);
    where.push(
      `(${column} AT TIME ZONE ${GT})::date <= $${params.length}::date`,
    );
  }
  return where;
}

/**
 * Customers of Listas Escolares: every non-draft list grouped by its phone
 * digits (owner decision). Money comes only from ACCEPTED lists
 * (`school_quotation_status_accepted`, migration 1760009000000): `paid` and
 * `balance` from the official `school_quotation_paid`; quotations (COTIZADA)
 * are counted apart and never owed; cancelled lists count for nothing.
 */
const CUSTOMER_CTE = `
  cq AS (
    SELECT q.id, q.quotation_number, q.customer_name, q.customer_phone, q.student_name, q.grade,
           q.quotation_date, q.delivery_date, q.status, q.total, q.created_at,
           regexp_replace(q.customer_phone, '\\D', '', 'g') AS ckey,
           school_quotation_paid(q.id) AS paid
      FROM school_quotations q WHERE q.status <> 'BORRADOR'
  ),
  lastpay AS (
    SELECT x.ckey, max(p.received_at) AS last_payment_at
      FROM school_quotation_payments p JOIN cq x ON x.id = p.quotation_id
     WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO'
     GROUP BY x.ckey
  ),
  agg AS (
    SELECT ckey AS key,
           (array_agg(customer_name ORDER BY created_at DESC))[1] AS name,
           (array_agg(customer_phone ORDER BY created_at DESC))[1] AS phone,
           array_agg(DISTINCT btrim(customer_name)) AS names,
           COALESCE(array_agg(DISTINCT student_name) FILTER (WHERE student_name IS NOT NULL), '{}') AS students,
           array_agg(DISTINCT grade) AS grades,
           array_agg(quotation_number ORDER BY quotation_number) AS numbers,
           count(*) AS lists,
           count(*) FILTER (WHERE school_quotation_status_accepted(status)) AS active_lists,
           COALESCE(SUM(total) FILTER (WHERE school_quotation_status_accepted(status)), 0) AS purchased,
           COALESCE(SUM(paid) FILTER (WHERE school_quotation_status_accepted(status)), 0) AS paid,
           COALESCE(SUM(total - paid) FILTER (WHERE school_quotation_status_accepted(status)), 0) AS balance,
           count(*) FILTER (WHERE status = 'COTIZADA') AS quotes,
           COALESCE(SUM(total) FILTER (WHERE status = 'COTIZADA'), 0) AS quoted_total,
           min(created_at) AS first_at,
           min(delivery_date) FILTER (WHERE school_quotation_status_accepted(status) AND total > paid) AS next_delivery
      FROM cq GROUP BY ckey
  ),
  customers AS (
    SELECT agg.*, lp.last_payment_at,
           CASE WHEN active_lists = 0 AND quotes > 0 THEN 'COTIZANDO'
                WHEN active_lists = 0 THEN 'CANCELADO'
                WHEN balance <= 0 THEN 'SOLVENTE'
                WHEN paid > 0 THEN 'ABONANDO'
                ELSE 'PENDIENTE' END AS account_status
      FROM agg LEFT JOIN lastpay lp ON lp.ckey = agg.key
  )`;

function toCustomer(row: SqlRow): CustomerRow {
  const names = ((row.names ?? []) as string[]).filter(Boolean);
  const name = text(row.name).trim();
  return {
    key: text(row.key),
    name,
    phone: text(row.phone),
    otherNames: names.filter((n) => n.toLowerCase() !== name.toLowerCase()),
    students: ((row.students ?? []) as string[]).filter(Boolean),
    grades: ((row.grades ?? []) as string[]).filter(Boolean),
    quotationNumbers: (row.numbers ?? []) as string[],
    lists: num(row.lists),
    activeLists: num(row.active_lists),
    purchased: num(row.purchased),
    paid: num(row.paid),
    balance: num(row.balance),
    quotes: num(row.quotes),
    quotedTotal: num(row.quoted_total),
    status: text(row.account_status) as CustomerAccountStatus,
    lastPaymentAt: textOrNull(row.last_payment_at),
    firstAt: text(row.first_at),
    nextDeliveryDate: row.next_delivery
      ? text(row.next_delivery).slice(0, 10)
      : null,
  };
}

/** A list payment with where its money went (Caja de Listas ledger). */
const PAYMENT_SELECT = `
  SELECT p.*, q.quotation_number, q.student_name, q.customer_name, q.customer_phone, b.name AS bank_name,
         ${USER_NAME('u')} AS received_by_name, ${USER_NAME('vu')} AS voided_by_name,
         o.receipt_number AS reversed_receipt, m.movement_type AS cash_type,
         r.transfer_status, r.pending AS pending_transfer
    FROM school_quotation_payments p
    JOIN school_quotations q ON q.id = p.quotation_id
    JOIN users u ON u.id = p.received_by
    LEFT JOIN users vu ON vu.id = p.voided_by
    LEFT JOIN banks b ON b.id = p.bank_id
    LEFT JOIN school_quotation_payments o ON o.id = p.reversal_of_id
    LEFT JOIN school_cash_movements m ON m.payment_id = p.id
    LEFT JOIN school_cash_pending_receipts r ON r.payment_id = p.id`;

function toPayment(row: SqlRow): CustomerPaymentRow {
  const cashType = textOrNull(row.cash_type);
  const destination: CustomerPaymentRow['destination'] = !cashType
    ? 'ANTERIOR'
    : cashType === 'PAGO_EFECTIVO' ||
        (cashType === 'DEVOLUCION' && text(row.payment_method) === 'EFECTIVO')
      ? 'CAJA'
      : cashType === 'PAGO_DEPOSITO' ||
          cashType === 'PAGO_TRANSFERENCIA' ||
          row.bank_id
        ? 'BANCO'
        : cashType === 'REVERSION'
          ? null
          : 'OTRO';
  return {
    id: text(row.id),
    // Receipt numbers are sequential (RLE-000123): the tie-break of the statement.
    seq: Number(text(row.receipt_number).replace(/\D/g, '')) || 0,
    quotationId: text(row.quotation_id),
    quotationNumber: text(row.quotation_number),
    studentName: textOrNull(row.student_name),
    receiptNumber: text(row.receipt_number),
    kind: text(row.kind),
    amount: num(row.amount),
    paymentMethod: text(row.payment_method),
    bankName: textOrNull(row.bank_name),
    reference: textOrNull(row.reference),
    observations: textOrNull(row.observations),
    balanceAfter: num(row.balance_after),
    status: text(row.status) as 'APLICADO' | 'ANULADO',
    reversedReceipt: textOrNull(row.reversed_receipt),
    receivedAt: text(row.received_at),
    receivedByName: text(row.received_by_name),
    voidedAt: textOrNull(row.voided_at),
    voidedByName: textOrNull(row.voided_by_name),
    voidReason: textOrNull(row.void_reason),
    destination,
    transferStatus: textOrNull(row.transfer_status),
    pendingTransfer:
      row.pending_transfer === null || row.pending_transfer === undefined
        ? null
        : num(row.pending_transfer),
  };
}

const PAYMENT_COUNTED = `(p.kind = 'DEVOLUCION' OR (p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO'))`;
const SIGNED_PAYMENT = `CASE WHEN p.kind = 'DEVOLUCION' THEN -p.amount ELSE p.amount END`;
/** An accepted list that can still owe money (quotations are not money, migration 1760009000000). */
const OPEN_SALE = `(school_quotation_status_accepted(q.status) AND q.status <> 'ENTREGADA')`;

/**
 * Reads and writes of the Caja de Listas. Every write is ONE call to its SQL
 * function (permissions, locks, idempotency and balances live there); the
 * reads are plain queries over the ledger and its views.
 */
@Injectable()
export class TypeOrmSchoolCashBoxRepository implements SchoolCashBoxRepository {
  constructor(private readonly dataSource: DataSource) {}

  async balance(): Promise<number> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT school_cash_balance() AS balance`,
    );
    return num(row.balance);
  }

  async pendingTotal(): Promise<number> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT school_cash_pending_total() AS total`,
    );
    return num(row.total);
  }

  async summary(
    today: string,
    period: SummaryPeriod,
  ): Promise<SchoolCashSummaryRow> {
    const from = period.from ?? null;
    const to = period.to ?? null;
    // Flow figures honor the period; snapshots (cash, pending, debts) are "now".
    const onPeriod = (column: string, first: number) =>
      `($${first}::date IS NULL OR (${column} AT TIME ZONE ${GT})::date >= $${first}::date)
       AND ($${first + 1}::date IS NULL OR (${column} AT TIME ZONE ${GT})::date <= $${first + 1}::date)`;
    const unit = period.granularity;
    const window = { day: '29 days', week: '11 weeks', month: '11 months' }[
      unit
    ];
    const [
      [totals],
      pendingByBank,
      series,
      recent,
      [lastCount],
      [portfolio],
      [customers],
    ] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT school_cash_balance() AS cash_balance,
                (SELECT COALESCE(SUM(pending), 0) FROM school_cash_pending_receipts) AS pending,
                (SELECT count(*) FROM school_cash_pending_receipts WHERE pending > 0) AS pending_receipts,
                (SELECT min(created_at) FROM school_cash_pending_receipts WHERE pending > 0) AS oldest_pending,
                (SELECT COALESCE(SUM(amount), 0) FROM school_cash_transfers t
                  WHERE status = 'APLICADO' AND ${onPeriod('t.created_at', 1)}) AS transferred,
                (SELECT count(*) FROM school_cash_transfers t
                  WHERE status = 'APLICADO' AND ${onPeriod('t.created_at', 1)}) AS transfers,
                (SELECT COALESCE(SUM(amount), 0) FROM school_cash_exits WHERE status = 'APLICADO') AS exits,
                (SELECT COALESCE(SUM(CASE direction WHEN 'IN' THEN amount ELSE -amount END), 0)
                   FROM school_cash_movements WHERE movement_type = 'AJUSTE' AND status = 'APLICADO') AS adjustments,
                pay.*, sales.*, quotes.*, unpaid.*, owed.*
           FROM (SELECT
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO' AND p.payment_method = 'EFECTIVO'), 0) AS cash,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO' AND p.payment_method = 'TRANSFERENCIA'), 0) AS transfer,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO' AND p.payment_method = 'DEPOSITO'), 0) AS deposit,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO' AND p.payment_method IN ('TARJETA','OTRO')), 0) AS other,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind = 'DEVOLUCION'), 0) AS refunds,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind = 'ANTICIPO' AND p.status = 'APLICADO'), 0) AS advances,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind = 'ABONO' AND p.status = 'APLICADO'), 0) AS installments,
                   COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO'
                       AND NOT EXISTS (SELECT 1 FROM school_cash_movements m WHERE m.payment_id = p.id)), 0) AS before_cash_box
                   FROM school_quotation_payments p WHERE ${onPeriod('p.received_at', 1)}) pay,
                (SELECT COALESCE(SUM(q.total) FILTER (WHERE school_quotation_status_accepted(q.status)), 0) AS sales_total,
                        count(*) FILTER (WHERE school_quotation_status_accepted(q.status)) AS sales_count
                   FROM school_quotations q
                  WHERE ($1::date IS NULL OR q.quotation_date >= $1::date)
                    AND ($2::date IS NULL OR q.quotation_date <= $2::date)) sales,
                (SELECT COALESCE(SUM(q.total), 0) AS quotes_total, count(*) AS quotes_count
                   FROM school_quotations q WHERE q.status = 'COTIZADA') quotes,
                (SELECT count(*) AS accepted_unpaid
                   FROM school_quotations q
                  WHERE q.status = 'ACEPTADA' AND school_quotation_paid(q.id) = 0
                    AND NOT EXISTS (SELECT 1 FROM school_quotation_payments p
                                     WHERE p.quotation_id = q.id AND p.status = 'APLICADO')
                    AND NOT EXISTS (SELECT 1 FROM school_quotation_item_assignments a
                                     WHERE a.quotation_id = q.id)) unpaid,
                (SELECT COALESCE(SUM(q.total - school_quotation_paid(q.id)) FILTER (WHERE ${OPEN_SALE}), 0) AS customers_balance,
                        count(*) FILTER (WHERE ${OPEN_SALE} AND q.total > school_quotation_paid(q.id)) AS customers_with_balance
                   FROM school_quotations q) owed`,
        [from, to],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT r.bank_id, b.name AS bank_name, SUM(r.pending) AS pending, count(*) AS receipts
           FROM school_cash_pending_receipts r JOIN banks b ON b.id = r.bank_id
          WHERE r.pending > 0 GROUP BY r.bank_id, b.name ORDER BY SUM(r.pending) DESC`,
      ),
      this.dataSource.query<SqlRow[]>(
        `WITH bounds AS (
           SELECT COALESCE($1::date, ($3::date - interval '${window}')::date) AS f, COALESCE($2::date, $3::date) AS t
         ), buckets AS (
           SELECT generate_series(date_trunc('${unit}', f::timestamp), date_trunc('${unit}', t::timestamp),
                                  interval '1 ${unit}')::date AS start, f, t FROM bounds
         )
         SELECT b.start::text AS start,
                COALESCE(SUM(p.amount) FILTER (WHERE p.payment_method = 'EFECTIVO'), 0) AS cash,
                COALESCE(SUM(p.amount) FILTER (WHERE p.payment_method IN ('TRANSFERENCIA','DEPOSITO')), 0) AS bank,
                COALESCE(SUM(p.amount) FILTER (WHERE p.payment_method IN ('TARJETA','OTRO')), 0) AS other
           FROM buckets b
           LEFT JOIN school_quotation_payments p
             ON date_trunc('${unit}', (p.received_at AT TIME ZONE ${GT}))::date = b.start
            AND (p.received_at AT TIME ZONE ${GT})::date BETWEEN b.f AND b.t
            AND p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO'
          GROUP BY b.start ORDER BY b.start`,
        [from, to, today],
      ),
      this.dataSource.query<SqlRow[]>(
        `${MOVEMENT_SELECT} ORDER BY m.sequence DESC LIMIT 8`,
      ),
      this.dataSource.query<SqlRow[]>(
        `${COUNT_SELECT} ORDER BY c.created_at DESC LIMIT 1`,
      ),
      this.dataSource.query<SqlRow[]>(
        `WITH l AS (SELECT q.status, q.total, school_quotation_paid(q.id) AS paid,
                           school_quotation_status_accepted(q.status) AS accepted
                      FROM school_quotations q WHERE q.status <> 'BORRADOR')
         SELECT count(*) FILTER (WHERE accepted OR status = 'CANCELADA') AS lists,
                count(*) FILTER (WHERE accepted AND total <= paid) AS paid,
                count(*) FILTER (WHERE accepted AND total > paid AND paid > 0) AS partial,
                count(*) FILTER (WHERE accepted AND paid = 0 AND total > 0) AS pending,
                count(*) FILTER (WHERE status = 'CANCELADA') AS cancelled,
                count(*) FILTER (WHERE status = 'COTIZADA') AS quotes,
                COALESCE(SUM(total) FILTER (WHERE status = 'COTIZADA'), 0) AS quotes_total,
                COALESCE(SUM(total) FILTER (WHERE accepted AND total <= paid), 0) AS paid_amount,
                COALESCE(SUM(total - paid) FILTER (WHERE accepted AND total > paid AND paid > 0), 0) AS partial_balance,
                COALESCE(SUM(total - paid) FILTER (WHERE accepted AND paid = 0), 0) AS pending_balance
           FROM l`,
      ),
      this.dataSource.query<SqlRow[]>(
        `WITH ${CUSTOMER_CTE}
         SELECT count(*) AS total,
                count(*) FILTER (WHERE balance > 0) AS with_balance,
                count(*) FILTER (WHERE account_status = 'SOLVENTE') AS solvent,
                count(*) FILTER (WHERE account_status = 'ABONANDO') AS paying,
                count(*) FILTER (WHERE account_status = 'PENDIENTE') AS not_paying
           FROM customers`,
      ),
    ]);
    const cash = num(totals.cash);
    const transfer = num(totals.transfer);
    const deposit = num(totals.deposit);
    const other = num(totals.other);
    const refunds = num(totals.refunds);
    return {
      period: { from, to, granularity: unit },
      cashBalance: num(totals.cash_balance),
      pendingTransfer: num(totals.pending),
      pendingReceipts: num(totals.pending_receipts),
      oldestPendingAt: textOrNull(totals.oldest_pending),
      transferredTotal: num(totals.transferred),
      transfersCount: num(totals.transfers),
      collected: {
        total:
          Math.round((cash + transfer + deposit + other - refunds) * 100) / 100,
        cash,
        transfer,
        deposit,
        other,
        refunds,
        advances: num(totals.advances),
        installments: num(totals.installments),
        beforeCashBox: num(totals.before_cash_box),
      },
      sales: { total: num(totals.sales_total), count: num(totals.sales_count) },
      quotes: {
        total: num(totals.quotes_total),
        count: num(totals.quotes_count),
      },
      acceptedWithoutPayments: num(totals.accepted_unpaid),
      customersBalance: num(totals.customers_balance),
      customersWithBalance: num(totals.customers_with_balance),
      exitsTotal: num(totals.exits),
      adjustmentsNet: num(totals.adjustments),
      lastCount: lastCount ? toCount(lastCount) : null,
      pendingByBank: pendingByBank.map((row) => ({
        bankId: text(row.bank_id),
        bankName: text(row.bank_name),
        pending: num(row.pending),
        receipts: num(row.receipts),
      })),
      series: series.map((row) => {
        const point = {
          start: text(row.start),
          cash: num(row.cash),
          bank: num(row.bank),
          other: num(row.other),
        };
        return {
          ...point,
          total:
            Math.round((point.cash + point.bank + point.other) * 100) / 100,
        };
      }),
      portfolio: {
        lists: num(portfolio.lists),
        paid: num(portfolio.paid),
        partial: num(portfolio.partial),
        pending: num(portfolio.pending),
        cancelled: num(portfolio.cancelled),
        quotes: num(portfolio.quotes),
        quotesTotal: num(portfolio.quotes_total),
        paidAmount: num(portfolio.paid_amount),
        partialBalance: num(portfolio.partial_balance),
        pendingBalance: num(portfolio.pending_balance),
      },
      customers: {
        total: num(customers.total),
        withBalance: num(customers.with_balance),
        solvent: num(customers.solvent),
        paying: num(customers.paying),
        notPaying: num(customers.not_paying),
      },
      recent: recent.map(toMovement),
    };
  }

  // ── Customers (same phone digits) ───────────────────────────────────────
  async listCustomers(filters: CustomerFilters): Promise<CustomerPage> {
    const params: unknown[] = [];
    const where: string[] = [];
    const add = (value: unknown) => {
      params.push(value);
      return `$${params.length}`;
    };
    if (filters.search?.trim()) {
      const term = add(filters.search.trim());
      const digits = filters.search.replace(/\D/g, '');
      const phone =
        digits.length >= 3
          ? ` OR x.ckey LIKE '%' || ${add(digits)} || '%'`
          : '';
      where.push(`EXISTS (SELECT 1 FROM cq x WHERE x.ckey = c.key AND (
          search_normalize(x.customer_name) LIKE '%' || search_normalize(${term}) || '%'
          OR search_normalize(COALESCE(x.student_name, '')) LIKE '%' || search_normalize(${term}) || '%'
          OR x.quotation_number ILIKE '%' || ${term} || '%'${phone}))`);
    }
    if (filters.grade) {
      where.push(
        `EXISTS (SELECT 1 FROM cq x WHERE x.ckey = c.key AND x.grade = ${add(filters.grade)})`,
      );
    }
    if (filters.dateFrom) {
      where.push(
        `EXISTS (SELECT 1 FROM cq x WHERE x.ckey = c.key AND x.quotation_date >= ${add(filters.dateFrom)}::date)`,
      );
    }
    if (filters.dateTo) {
      where.push(
        `EXISTS (SELECT 1 FROM cq x WHERE x.ckey = c.key AND x.quotation_date <= ${add(filters.dateTo)}::date)`,
      );
    }
    if (filters.status) {
      where.push(`c.account_status = ${add(filters.status)}`);
    }
    const view: Record<string, string> = {
      WITH_BALANCE: 'c.balance > 0',
      SOLVENT: `c.account_status = 'SOLVENTE'`,
      NO_PAYMENTS: `c.account_status = 'PENDIENTE'`,
      WITH_PAYMENTS: 'c.paid > 0',
    };
    if (view[filters.view]) {
      where.push(view[filters.view]);
    }
    const order: Record<string, string> = {
      BALANCE: 'c.balance DESC, lower(c.name)',
      PAID: 'c.paid DESC, lower(c.name)',
      PURCHASED: 'c.purchased DESC, lower(c.name)',
      LAST_PAYMENT: 'c.last_payment_at DESC NULLS LAST, lower(c.name)',
      NAME: 'lower(c.name), c.key',
    };
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const base = `WITH ${CUSTOMER_CTE} SELECT c.* FROM customers c ${clause}`;
    const [[agg], rows] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT count(*) AS customers, COALESCE(SUM(purchased), 0) AS purchased, COALESCE(SUM(paid), 0) AS paid,
                COALESCE(SUM(balance), 0) AS balance,
                count(*) FILTER (WHERE account_status = 'SOLVENTE') AS solvente,
                count(*) FILTER (WHERE account_status = 'ABONANDO') AS abonando,
                count(*) FILTER (WHERE account_status = 'COTIZANDO') AS cotizando,
                count(*) FILTER (WHERE account_status = 'PENDIENTE') AS pendiente,
                count(*) FILTER (WHERE account_status = 'CANCELADO') AS cancelado
           FROM (${base}) f`,
        params,
      ),
      this.dataSource.query<SqlRow[]>(
        `${base} ORDER BY ${order[filters.sort] ?? order.BALANCE}
          LIMIT ${filters.limit} OFFSET ${(filters.page - 1) * filters.limit}`,
        params,
      ),
    ]);
    return {
      items: rows.map(toCustomer),
      total: num(agg.customers),
      page: filters.page,
      limit: filters.limit,
      totals: {
        customers: num(agg.customers),
        purchased: num(agg.purchased),
        paid: num(agg.paid),
        balance: num(agg.balance),
        byStatus: {
          SOLVENTE: num(agg.solvente),
          ABONANDO: num(agg.abonando),
          PENDIENTE: num(agg.pendiente),
          COTIZANDO: num(agg.cotizando),
          CANCELADO: num(agg.cancelado),
        },
      },
    };
  }

  async findCustomer(key: string): Promise<CustomerDetailRaw | null> {
    const [customer] = await this.dataSource.query<SqlRow[]>(
      `WITH ${CUSTOMER_CTE} SELECT c.* FROM customers c WHERE c.key = $1`,
      [key],
    );
    if (!customer) {
      return null;
    }
    const [lists, payments, history] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT q.id, q.quotation_number, q.student_name, q.grade, q.quotation_date::text AS quotation_date,
                q.delivery_date::text AS delivery_date, q.status, q.total, q.created_at,
                school_quotation_paid(q.id) AS paid,
                (SELECT count(*) FROM school_quotation_items i WHERE i.quotation_id = q.id) AS item_count
           FROM school_quotations q
          WHERE regexp_replace(q.customer_phone, '\\D', '', 'g') = $1
          ORDER BY q.quotation_date DESC, q.created_at DESC`,
        [key],
      ),
      this.dataSource.query<SqlRow[]>(
        `${PAYMENT_SELECT}
          WHERE regexp_replace(q.customer_phone, '\\D', '', 'g') = $1
          ORDER BY p.received_at DESC, p.receipt_number DESC`,
        [key],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT h.id AS seq, h.entity_id AS quotation_id, h.action, h.from_status, h.to_status, h.details, h.created_at
           FROM school_list_history h JOIN school_quotations q ON q.id = h.entity_id
          WHERE h.entity_type = 'QUOTATION' AND regexp_replace(q.customer_phone, '\\D', '', 'g') = $1
          ORDER BY h.id`,
        [key],
      ),
    ]);
    return {
      customer: toCustomer(customer),
      lists: lists.map((row) => {
        const total = num(row.total);
        const paid = num(row.paid);
        return {
          id: text(row.id),
          quotationNumber: text(row.quotation_number),
          studentName: textOrNull(row.student_name),
          grade: text(row.grade),
          quotationDate: text(row.quotation_date),
          deliveryDate: textOrNull(row.delivery_date),
          status: text(row.status),
          total,
          paid,
          // Only an accepted list is owed; a quotation is not money.
          balance: isAcceptedSchoolStatus(text(row.status))
            ? Math.round((total - paid) * 100) / 100
            : 0,
          itemCount: num(row.item_count),
          createdAt: text(row.created_at),
        };
      }),
      payments: payments.map(toPayment),
      history: history.map((row) => ({
        seq: num(row.seq),
        quotationId: text(row.quotation_id),
        action: text(row.action),
        fromStatus: textOrNull(row.from_status),
        toStatus: textOrNull(row.to_status),
        details: (row.details ?? {}) as Record<string, unknown>,
        createdAt: text(row.created_at),
      })),
    };
  }

  async listPayments(filters: PaymentFilters): Promise<PaymentPage> {
    const params: unknown[] = [];
    const add = (value: unknown) => {
      params.push(value);
      return `$${params.length}`;
    };
    const where = rangeOnInstant('p.received_at', filters, params);
    if (filters.method) {
      where.push(`p.payment_method = ${add(filters.method)}`);
    }
    if (filters.kind) {
      where.push(`p.kind = ${add(filters.kind)}`);
    }
    if (filters.status) {
      where.push(`p.status = ${add(filters.status)}`);
    }
    if (filters.bankId) {
      where.push(`p.bank_id = ${add(filters.bankId)}::uuid`);
    }
    if (filters.search?.trim()) {
      const term = add(filters.search.trim());
      where.push(`(search_normalize(q.customer_name) LIKE '%' || search_normalize(${term}) || '%'
                   OR search_normalize(COALESCE(q.student_name, '')) LIKE '%' || search_normalize(${term}) || '%'
                   OR q.quotation_number ILIKE '%' || ${term} || '%' OR p.receipt_number ILIKE '%' || ${term} || '%'
                   OR p.reference ILIKE '%' || ${term} || '%' OR q.customer_phone ILIKE '%' || ${term} || '%')`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[agg], rows] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT count(*) AS total,
                COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO'), 0) AS received,
                COALESCE(SUM(p.amount) FILTER (WHERE p.kind = 'DEVOLUCION'), 0) AS refunds,
                COALESCE(SUM(p.amount) FILTER (WHERE p.kind IN ('ANTICIPO','ABONO') AND p.status = 'ANULADO'), 0) AS voided
           FROM school_quotation_payments p JOIN school_quotations q ON q.id = p.quotation_id ${clause}`,
        params,
      ),
      this.dataSource.query<SqlRow[]>(
        `${PAYMENT_SELECT} ${clause} ORDER BY p.received_at DESC, p.receipt_number DESC
          LIMIT ${filters.limit} OFFSET ${(filters.page - 1) * filters.limit}`,
        params,
      ),
    ]);
    return {
      items: rows.map((row) => ({
        ...toPayment(row),
        customerName: text(row.customer_name),
        customerPhone: text(row.customer_phone),
      })),
      total: num(agg.total),
      page: filters.page,
      limit: filters.limit,
      totals: {
        received: num(agg.received),
        refunds: num(agg.refunds),
        voided: num(agg.voided),
      },
    };
  }

  async listMovements(
    filters: MovementFilters,
  ): Promise<Page<SchoolCashMovementRow>> {
    const params: unknown[] = [];
    const where: string[] = [];
    if (filters.dateFrom) {
      params.push(filters.dateFrom);
      where.push(`m.business_date >= $${params.length}::date`);
    }
    if (filters.dateTo) {
      params.push(filters.dateTo);
      where.push(`m.business_date <= $${params.length}::date`);
    }
    if (filters.movementType) {
      params.push(filters.movementType);
      where.push(`m.movement_type = $${params.length}`);
    }
    if (filters.bankId) {
      params.push(filters.bankId);
      where.push(`m.bank_id = $${params.length}::uuid`);
    }
    if (filters.userId) {
      params.push(filters.userId);
      where.push(`m.user_id = $${params.length}::uuid`);
    }
    if (filters.search) {
      params.push(`%${filters.search.trim()}%`);
      const p = `$${params.length}`;
      where.push(`(m.movement_number ILIKE ${p} OR m.quotation_number ILIKE ${p} OR m.customer_name ILIKE ${p}
                   OR m.receipt_number ILIKE ${p} OR m.reference ILIKE ${p} OR m.description ILIKE ${p})`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [{ count }] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS count FROM school_cash_movements m ${clause}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${MOVEMENT_SELECT} ${clause} ORDER BY m.sequence DESC
        LIMIT ${filters.limit} OFFSET ${(filters.page - 1) * filters.limit}`,
      params,
    );
    return {
      items: rows.map(toMovement),
      total: num(count),
      page: filters.page,
      limit: filters.limit,
    };
  }

  async findMovement(id: string): Promise<SchoolCashMovementRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${MOVEMENT_SELECT} WHERE m.id = $1`,
      [id],
    );
    return row ? toMovement(row) : null;
  }

  async listReceipts(filters: ReceiptFilters): Promise<SchoolCashReceiptRow[]> {
    const params: unknown[] = [];
    const where: string[] = filters.scope === 'OPEN' ? ['r.pending > 0'] : [];
    if (filters.bankId) {
      params.push(filters.bankId);
      where.push(`r.bank_id = $${params.length}::uuid`);
    }
    if (filters.search) {
      params.push(`%${filters.search.trim()}%`);
      const p = `$${params.length}`;
      where.push(
        `(r.quotation_number ILIKE ${p} OR r.customer_name ILIKE ${p} OR r.receipt_number ILIKE ${p} OR r.reference ILIKE ${p})`,
      );
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await this.dataSource.query<SqlRow[]>(
      `${RECEIPT_SELECT} ${clause} ORDER BY r.sequence ${filters.scope === 'OPEN' ? 'ASC' : 'DESC'} LIMIT 500`,
      params,
    );
    return rows.map(toReceipt);
  }

  async listTransfers(
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashTransferRow>> {
    return this.page(
      TRANSFER_SELECT,
      'school_cash_transfers t',
      't.created_at',
      filters,
      toTransfer,
    );
  }

  async findTransfer(id: string): Promise<SchoolCashTransferRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${TRANSFER_SELECT} WHERE t.id = $1`,
      [id],
    );
    return row ? toTransfer(row) : null;
  }

  async listExits(filters: DateRangeFilters): Promise<Page<SchoolCashExitRow>> {
    return this.page(
      EXIT_SELECT,
      'school_cash_exits e',
      'e.created_at',
      filters,
      toExit,
    );
  }

  async findExit(id: string): Promise<SchoolCashExitRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${EXIT_SELECT} WHERE e.id = $1`,
      [id],
    );
    return row ? toExit(row) : null;
  }

  async listCounts(
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashCountRow>> {
    return this.page(
      COUNT_SELECT,
      'school_cash_counts c',
      'c.created_at',
      filters,
      toCount,
    );
  }

  async findCount(id: string): Promise<SchoolCashCountRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${COUNT_SELECT} WHERE c.id = $1`,
      [id],
    );
    return row ? toCount(row) : null;
  }

  async listUsers(): Promise<CashUser[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT DISTINCT u.id, ${USER_NAME('u')} AS name
         FROM school_cash_movements m JOIN users u ON u.id = m.user_id ORDER BY 2`,
    );
    return rows.map((row) => ({ id: text(row.id), name: text(row.name) }));
  }

  // ── Writers (one SQL function each) ─────────────────────────────────────
  registerTransfer(
    input: TransferInput,
    userId: string,
    key: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT register_school_cash_transfer($1, $2::jsonb, $3, $4, $5, $6) AS id`,
      [
        input.bankId,
        JSON.stringify(input.items),
        input.reference ?? null,
        input.observations ?? null,
        userId,
        key,
      ],
    );
  }

  voidTransfer(id: string, reason: string, userId: string): Promise<string> {
    return this.scalar(`SELECT void_school_cash_transfer($1, $2, $3) AS id`, [
      id,
      reason,
      userId,
    ]);
  }

  registerExit(input: ExitInput, userId: string, key: string): Promise<string> {
    return this.scalar(
      `SELECT register_school_cash_exit($1, $2, $3, $4, $5, $6, $7, $8) AS id`,
      [
        input.amount,
        input.destination,
        input.bankId ?? null,
        input.recipientName ?? null,
        input.reason,
        input.reference ?? null,
        userId,
        key,
      ],
    );
  }

  voidExit(id: string, reason: string, userId: string): Promise<string> {
    return this.scalar(`SELECT void_school_cash_exit($1, $2, $3) AS id`, [
      id,
      reason,
      userId,
    ]);
  }

  registerAdjustment(
    input: AdjustmentInput,
    userId: string,
    key: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT register_school_cash_adjustment($1, $2, $3, $4, $5) AS id`,
      [input.direction, input.amount, input.reason, userId, key],
    );
  }

  voidAdjustment(
    movementId: string,
    reason: string,
    userId: string,
  ): Promise<string> {
    return this.scalar(`SELECT void_school_cash_adjustment($1, $2, $3) AS id`, [
      movementId,
      reason,
      userId,
    ]);
  }

  registerCount(
    input: CountInput,
    userId: string,
    key: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT register_school_cash_count($1::jsonb, $2, $3, $4) AS id`,
      [JSON.stringify(input.details), input.observations ?? null, userId, key],
    );
  }

  // ── Reports ─────────────────────────────────────────────────────────────
  async reportRows(
    kind: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<ReportRecord[]> {
    const range = [dateFrom, dateTo];
    const onDay = (column: string) =>
      `(${column} AT TIME ZONE ${GT})::date BETWEEN $1::date AND $2::date`;
    let sql: string;
    let params: unknown[] = range;
    switch (kind) {
      case 'recaudacion-diaria':
        sql = `SELECT (p.received_at AT TIME ZONE ${GT})::date::text AS day,
                      count(*) FILTER (WHERE p.kind <> 'DEVOLUCION') AS payments,
                      COALESCE(SUM(p.amount) FILTER (WHERE p.kind <> 'DEVOLUCION' AND p.payment_method = 'EFECTIVO'), 0) AS cash,
                      COALESCE(SUM(p.amount) FILTER (WHERE p.kind <> 'DEVOLUCION' AND p.payment_method = 'TRANSFERENCIA'), 0) AS transfer,
                      COALESCE(SUM(p.amount) FILTER (WHERE p.kind <> 'DEVOLUCION' AND p.payment_method = 'DEPOSITO'), 0) AS deposit,
                      COALESCE(SUM(p.amount) FILTER (WHERE p.kind <> 'DEVOLUCION' AND p.payment_method IN ('TARJETA','OTRO')), 0) AS other,
                      COALESCE(SUM(p.amount) FILTER (WHERE p.kind = 'DEVOLUCION'), 0) AS refunds,
                      SUM(${SIGNED_PAYMENT}) AS net
                 FROM school_quotation_payments p
                WHERE ${PAYMENT_COUNTED} AND ${onDay('p.received_at')}
                GROUP BY 1 ORDER BY 1`;
        break;
      case 'recaudacion-cliente':
        sql = `SELECT min(q.customer_name) AS customer, min(q.customer_phone) AS phone,
                      count(DISTINCT q.id) AS lists, count(*) FILTER (WHERE p.kind <> 'DEVOLUCION') AS payments,
                      SUM(${SIGNED_PAYMENT}) AS collected,
                      (SELECT COALESCE(SUM(q2.total - school_quotation_paid(q2.id)), 0) FROM school_quotations q2
                        WHERE lower(btrim(q2.customer_name)) = lower(btrim(min(q.customer_name)))
                          AND regexp_replace(q2.customer_phone, '\\D', '', 'g') = regexp_replace(min(q.customer_phone), '\\D', '', 'g')
                          AND school_quotation_status_accepted(q2.status) AND q2.status <> 'ENTREGADA') AS balance
                 FROM school_quotation_payments p JOIN school_quotations q ON q.id = p.quotation_id
                WHERE ${PAYMENT_COUNTED} AND ${onDay('p.received_at')}
                GROUP BY lower(btrim(q.customer_name)), regexp_replace(q.customer_phone, '\\D', '', 'g')
                ORDER BY collected DESC, customer`;
        break;
      case 'recaudacion-lista':
        sql = `SELECT q.quotation_number AS quotation, q.quotation_date::text AS date, q.customer_name AS customer,
                      q.status, q.total, SUM(${SIGNED_PAYMENT}) AS collected,
                      school_quotation_paid(q.id) AS paid, q.total - school_quotation_paid(q.id) AS balance
                 FROM school_quotation_payments p JOIN school_quotations q ON q.id = p.quotation_id
                WHERE ${PAYMENT_COUNTED} AND ${onDay('p.received_at')}
                GROUP BY q.id ORDER BY q.quotation_number`;
        break;
      case 'pagos-efectivo':
        sql = `SELECT p.received_at AS at, p.receipt_number AS receipt, q.quotation_number AS quotation,
                      q.customer_name AS customer, p.kind, p.amount, p.status, ${USER_NAME('u')} AS user
                 FROM school_quotation_payments p
                 JOIN school_quotations q ON q.id = p.quotation_id
                 JOIN users u ON u.id = p.received_by
                WHERE p.kind IN ('ANTICIPO','ABONO') AND p.payment_method = 'EFECTIVO' AND ${onDay('p.received_at')}
                ORDER BY p.received_at`;
        break;
      case 'pagos-bancarios':
        sql = `SELECT p.received_at AS at, p.receipt_number AS receipt, q.quotation_number AS quotation,
                      q.customer_name AS customer, p.payment_method AS method, b.name AS bank, p.reference, p.amount,
                      COALESCE(r.transferred, 0) AS transferred, COALESCE(r.pending, 0) AS pending,
                      CASE WHEN p.status = 'ANULADO' THEN 'ANULADO'
                           WHEN r.id IS NULL THEN 'ANTERIOR_A_LA_CAJA' ELSE r.transfer_status END AS "transferStatus"
                 FROM school_quotation_payments p
                 JOIN school_quotations q ON q.id = p.quotation_id
                 LEFT JOIN banks b ON b.id = p.bank_id
                 LEFT JOIN school_cash_pending_receipts r ON r.payment_id = p.id
                WHERE p.kind IN ('ANTICIPO','ABONO') AND p.payment_method IN ('TRANSFERENCIA','DEPOSITO')
                  AND ${onDay('p.received_at')}
                ORDER BY p.received_at`;
        break;
      case 'traslados':
        sql = `SELECT t.created_at AS at, t.transfer_number AS number, b.name AS bank, t.reference,
                      (SELECT count(*) FROM school_cash_receipt_applications a WHERE a.transfer_id = t.id) AS payments,
                      CASE WHEN t.status = 'APLICADO' THEN t.amount ELSE 0 END AS amount, t.status, ${USER_NAME('u')} AS user
                 FROM school_cash_transfers t JOIN banks b ON b.id = t.bank_id JOIN users u ON u.id = t.user_id
                WHERE ${onDay('t.created_at')} ORDER BY t.created_at`;
        break;
      case 'pendiente-traslado':
        params = [];
        sql = `SELECT r.created_at AS at, r.receipt_number AS receipt, r.quotation_number AS quotation,
                      r.customer_name AS customer, b.name AS bank, r.reference, r.amount, r.pending,
                      r.transfer_status AS "transferStatus"
                 FROM school_cash_pending_receipts r JOIN banks b ON b.id = r.bank_id
                WHERE r.pending > 0 ORDER BY r.sequence`;
        break;
      case 'arqueos':
        sql = `SELECT c.created_at AS at, c.count_number AS number, c.theoretical_balance AS theoretical,
                      c.counted_total AS counted, c.difference, c.status, ${USER_NAME('u')} AS user, c.observations
                 FROM school_cash_counts c JOIN users u ON u.id = c.user_id
                WHERE ${onDay('c.created_at')} ORDER BY c.created_at`;
        break;
      case 'salidas':
        sql = `SELECT e.created_at AS at, e.exit_number AS number, e.destination, b.name AS bank,
                      e.recipient_name AS recipient, e.reason,
                      CASE WHEN e.status = 'APLICADO' THEN e.amount ELSE 0 END AS amount, e.status
                 FROM school_cash_exits e LEFT JOIN banks b ON b.id = e.bank_id
                WHERE ${onDay('e.created_at')} ORDER BY e.created_at`;
        break;
      case 'saldos-clientes':
        params = [];
        sql = `SELECT * FROM (
                 SELECT q.quotation_number AS quotation, q.quotation_date::text AS date, q.customer_name AS customer,
                        q.customer_phone AS phone, q.status, q.total, school_quotation_paid(q.id) AS paid,
                        q.total - school_quotation_paid(q.id) AS balance
                   FROM school_quotations q WHERE ${OPEN_SALE}) s
                WHERE balance > 0 ORDER BY quotation`;
        break;
      case 'estado-listas':
        // Quotations are information only: they never add to sold, collected or owed.
        sql = `SELECT quotation, date, customer,
                      CASE WHEN status = 'COTIZADA' THEN 'COTIZACION'
                           WHEN status IN ('CANCELADA','EN_PREPARACION','TERMINADA','ENTREGADA') THEN status
                           ELSE 'ACEPTADA' END AS stage,
                      CASE WHEN NOT accepted THEN 'NO_APLICA'
                           WHEN paid >= total THEN 'PAGADA'
                           WHEN paid > 0 THEN 'PARCIAL' ELSE 'PENDIENTE' END AS payment,
                      CASE WHEN status = 'COTIZADA' THEN total ELSE 0 END AS quoted,
                      CASE WHEN accepted THEN total ELSE 0 END AS sold,
                      CASE WHEN accepted THEN paid ELSE 0 END AS paid,
                      CASE WHEN accepted THEN total - paid ELSE 0 END AS balance
                 FROM (SELECT q.quotation_number AS quotation, q.quotation_date::text AS date,
                              q.customer_name AS customer, q.status, q.total,
                              school_quotation_paid(q.id) AS paid,
                              school_quotation_status_accepted(q.status) AS accepted
                         FROM school_quotations q
                        WHERE q.status <> 'BORRADOR'
                          AND q.quotation_date BETWEEN $1::date AND $2::date) l
                ORDER BY quotation`;
        break;
      case 'cartera-clientes':
        params = [];
        sql = `WITH ${CUSTOMER_CTE}
               SELECT name AS customer, phone, array_to_string(students, ', ') AS students, active_lists AS lists,
                      purchased, paid, balance, last_payment_at AS "lastPayment", account_status AS status
                 FROM customers WHERE active_lists > 0
                ORDER BY balance DESC, lower(name)`;
        break;
      case 'movimientos':
        sql = `SELECT m.created_at AS at, m.movement_number AS number, m.movement_type AS type, m.description,
                      b.name AS bank, m.reference,
                      CASE WHEN m.direction = 'IN' THEN m.amount ELSE 0 END AS "cashIn",
                      CASE WHEN m.direction = 'OUT' THEN m.amount ELSE 0 END AS "cashOut",
                      m.balance_after AS balance, ${USER_NAME('u')} AS user
                 FROM school_cash_movements m JOIN users u ON u.id = m.user_id LEFT JOIN banks b ON b.id = m.bank_id
                WHERE m.business_date BETWEEN $1::date AND $2::date ORDER BY m.sequence`;
        break;
      default:
        throw schoolListError('SCHOOL_CASH_INVALID_REPORT');
    }
    const rows = await this.dataSource.query<SqlRow[]>(sql, params);
    return rows.map((row) => {
      const record: ReportRecord = {};
      for (const [key, value] of Object.entries(row)) {
        record[key] =
          value === null || value === undefined
            ? null
            : value instanceof Date
              ? value.toISOString()
              : typeof value === 'number'
                ? value
                : text(value);
      }
      return record;
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  private async page<T>(
    select: string,
    from: string,
    instantColumn: string,
    filters: DateRangeFilters,
    map: (row: SqlRow) => T,
  ): Promise<Page<T>> {
    const params: unknown[] = [];
    const where = rangeOnInstant(instantColumn, filters, params);
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [{ count }] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS count FROM ${from} ${clause}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${select} ${clause} ORDER BY ${instantColumn} DESC
        LIMIT ${filters.limit} OFFSET ${(filters.page - 1) * filters.limit}`,
      params,
    );
    return {
      items: rows.map(map),
      total: num(count),
      page: filters.page,
      limit: filters.limit,
    };
  }

  /** Runs a writer function and returns its `id`, mapping its RAISE codes. */
  private async scalar(sql: string, params: unknown[]): Promise<string> {
    try {
      const [row] = await this.dataSource.query<SqlRow[]>(sql, params);
      return text(row.id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const mapped =
          schoolListErrorFromMessage(error.message) ??
          bankMovementErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
        const code = (error.driverError as { code?: string } | undefined)?.code;
        if (code === '22P02' || code === '22003') {
          throw schoolListError('SCHOOL_CASH_INVALID_AMOUNT');
        }
      }
      throw error;
    }
  }
}
