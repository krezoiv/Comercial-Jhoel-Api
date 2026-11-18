import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  AccountSummary,
  CancelInput,
  DashboardRow,
  FindQuotationsOptions,
  HistoryRow,
  Paginated,
  PaymentInput,
  PaymentRow,
  QuotationDetailRow,
  QuotationInput,
  QuotationItemRow,
  QuotationSummaryRow,
  SchoolAccountStatus,
  SchoolListRepository,
  SchoolQuotationStatus,
  SchoolStatusAction,
  TemplateInput,
  TemplateRow,
  TemplateSummaryRow,
} from '../../domain/repositories/school-list.repository';
import {
  schoolListError,
  schoolListErrorFromMessage,
} from '../../domain/errors/school-list.errors';

type SqlRow = Record<string, unknown>;

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

function numOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

/** `DATE` columns are read as `yyyy-MM-dd` text (`::text` in every query). */
function dateOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

function accountStatus(
  status: string,
  paid: number,
  balance: number,
): SchoolAccountStatus {
  if (status === 'CANCELADA') {
    return 'CERRADA';
  }
  if (balance <= 0) {
    return 'PAGADA';
  }
  return paid > 0 ? 'PARCIAL' : 'PENDIENTE';
}

/** Net paid of `q` as a correlated sub-select (same rule as `school_quotation_paid`). */
const PAID_SQL = `COALESCE((
  SELECT SUM(CASE WHEN p.kind IN ('ANTICIPO','ABONO') AND p.status = 'APLICADO' THEN p.amount
                  WHEN p.kind = 'DEVOLUCION' THEN -p.amount ELSE 0 END)
    FROM school_quotation_payments p WHERE p.quotation_id = q.id), 0)`;

const QUOTATION_SELECT = `
  SELECT q.id, q.quotation_number, q.quotation_date::text AS quotation_date,
         q.delivery_date::text AS delivery_date, q.customer_name, q.customer_phone, q.student_name,
         q.grade, q.template_id, q.template_name, q.subtotal, q.discount, q.total, q.status,
         q.version, q.observations, q.created_at, q.updated_at, q.finished_at, q.delivered_at, q.cancelled_at,
         q.cancel_reason, cu.username AS created_by_username, du.username AS delivered_by_username,
         xu.username AS cancelled_by_username, tu.username AS finished_by_username, ${PAID_SQL} AS paid
    FROM school_quotations q
    JOIN users cu ON cu.id = q.created_by
    LEFT JOIN users du ON du.id = q.delivered_by
    LEFT JOIN users xu ON xu.id = q.cancelled_by
    LEFT JOIN users tu ON tu.id = q.finished_by`;

/** Movement effect on the amount paid (see `school_quotation_paid`). */
const PAYMENT_SELECT = `
  SELECT p.*, b.name AS bank_name, ru.username AS received_by_username,
         vu.username AS voided_by_username,
         CASE WHEN p.kind IN ('ANTICIPO','ABONO') THEN p.amount ELSE -p.amount END AS effect
    FROM school_quotation_payments p
    JOIN users ru ON ru.id = p.received_by
    LEFT JOIN users vu ON vu.id = p.voided_by
    LEFT JOIN banks b ON b.id = p.bank_id`;

function toSummary(row: SqlRow): QuotationSummaryRow {
  const total = num(row.total);
  const paid = num(row.paid);
  const status = text(row.status) as SchoolQuotationStatus;
  const balance =
    status === 'CANCELADA' ? 0 : Math.round((total - paid) * 100) / 100;
  return {
    id: text(row.id),
    quotationNumber: text(row.quotation_number),
    quotationDate: text(row.quotation_date),
    deliveryDate: dateOrNull(row.delivery_date),
    customerName: text(row.customer_name),
    customerPhone: text(row.customer_phone),
    studentName: textOrNull(row.student_name),
    grade: text(row.grade),
    templateId: textOrNull(row.template_id),
    templateName: textOrNull(row.template_name),
    total,
    paid,
    balance,
    status,
    accountStatus: accountStatus(status, paid, balance),
    version: num(row.version),
    createdAt: text(row.created_at),
    createdByUsername: text(row.created_by_username),
  };
}

function toPayment(row: SqlRow, runningBalance: number): PaymentRow {
  return {
    id: text(row.id),
    quotationId: text(row.quotation_id),
    receiptNumber: text(row.receipt_number),
    kind: text(row.kind) as PaymentRow['kind'],
    amount: num(row.amount),
    effect: num(row.effect),
    runningBalance,
    paymentMethod: text(row.payment_method) as PaymentRow['paymentMethod'],
    bankId: textOrNull(row.bank_id),
    bankName: textOrNull(row.bank_name),
    reference: textOrNull(row.reference),
    observations: textOrNull(row.observations),
    status: text(row.status) as PaymentRow['status'],
    reversalOfId: textOrNull(row.reversal_of_id),
    receivedAt: text(row.received_at),
    receivedByUsername: text(row.received_by_username),
    voidedAt: textOrNull(row.voided_at),
    voidedByUsername: textOrNull(row.voided_by_username),
    voidReason: textOrNull(row.void_reason),
  };
}

function toTemplateSummary(row: SqlRow): TemplateSummaryRow {
  return {
    id: text(row.id),
    name: text(row.name),
    grade: text(row.grade),
    description: textOrNull(row.description),
    isActive: row.is_active === true,
    sortOrder: num(row.sort_order),
    version: num(row.version),
    itemCount: num(row.item_count),
    total: num(row.total),
    updatedAt: text(row.updated_at),
    updatedByUsername: textOrNull(row.updated_by_username),
  };
}

const TEMPLATE_SELECT = `
  SELECT t.*, uu.username AS updated_by_username,
         (SELECT count(*) FROM school_list_template_items i WHERE i.template_id = t.id) AS item_count,
         (SELECT COALESCE(SUM(i.subtotal), 0) FROM school_list_template_items i WHERE i.template_id = t.id) AS total
    FROM school_list_templates t
    LEFT JOIN users uu ON uu.id = COALESCE(t.updated_by, t.created_by)`;

@Injectable()
export class TypeOrmSchoolListRepository implements SchoolListRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // ── Templates ────────────────────────────────────────────────────────────
  async listTemplates(includeInactive: boolean): Promise<TemplateSummaryRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `${TEMPLATE_SELECT} WHERE ($1::boolean OR t.is_active) ORDER BY t.sort_order, t.name`,
      [includeInactive],
    );
    return rows.map(toTemplateSummary);
  }

  async getTemplate(id: string): Promise<TemplateRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${TEMPLATE_SELECT} WHERE t.id = $1`,
      [id],
    );
    if (!row) {
      return null;
    }
    const items = await this.dataSource.query<SqlRow[]>(
      `SELECT i.*, CASE WHEN pr.is_active THEN pr.public_price END AS inventory_price
         FROM school_list_template_items i
         LEFT JOIN products pr ON pr.id = i.product_id
        WHERE i.template_id = $1 ORDER BY i.line_no`,
      [id],
    );
    return {
      ...toTemplateSummary(row),
      items: items.map((item) => ({
        id: text(item.id),
        lineNo: num(item.line_no),
        productId: textOrNull(item.product_id),
        productName: text(item.product_name),
        description: textOrNull(item.description),
        quantity: num(item.quantity),
        unitPrice: num(item.unit_price),
        subtotal: num(item.subtotal),
        observations: textOrNull(item.observations),
        inventoryPrice: numOrNull(item.inventory_price),
      })),
    };
  }

  async saveTemplate(
    id: string | null,
    input: TemplateInput,
    userId: string,
    expectedVersion: number | null,
  ): Promise<string> {
    return this.scalar(
      `SELECT save_school_list_template($1, $2::jsonb, $3, $4) AS id`,
      [id, JSON.stringify(input), userId, expectedVersion],
    );
  }

  async setTemplateActive(
    id: string,
    active: boolean,
    userId: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT set_school_list_template_active($1, $2, $3) AS id`,
      [id, active, userId],
    );
  }

  async duplicateTemplate(
    id: string,
    name: string,
    grade: string | null,
    userId: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT duplicate_school_list_template($1, $2, $3, $4) AS id`,
      [id, name, grade, userId],
    );
  }

  // ── Quotations ───────────────────────────────────────────────────────────
  async findQuotations(
    options: FindQuotationsOptions,
  ): Promise<Paginated<QuotationSummaryRow>> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replace('?', `$${params.length}`));
    };
    if (options.search) {
      add(
        `(q.customer_name ILIKE ? OR q.student_name ILIKE $${params.length + 1})`,
        `%${options.search}%`,
      );
    }
    if (options.phone) {
      add(
        `regexp_replace(q.customer_phone, '[^0-9]', '', 'g') LIKE ?`,
        `%${options.phone.replace(/\D/g, '')}%`,
      );
    }
    if (options.number) {
      add(`q.quotation_number ILIKE ?`, `%${options.number}%`);
    }
    if (options.grade) {
      add(`q.grade = ?`, options.grade);
    }
    if (options.status) {
      add(`q.status = ?`, options.status);
    }
    if (options.dateFrom) {
      add(`q.quotation_date >= ?::date`, options.dateFrom);
    }
    if (options.dateTo) {
      add(`q.quotation_date <= ?::date`, options.dateTo);
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [{ count }] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*)::int AS count FROM school_quotations q ${filter}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${QUOTATION_SELECT} ${filter}
        ORDER BY q.quotation_date DESC, q.created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map(toSummary),
      total: num(count),
      page: options.page,
      limit: options.limit,
    };
  }

  async getQuotation(id: string): Promise<QuotationDetailRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${QUOTATION_SELECT} WHERE q.id = $1`,
      [id],
    );
    if (!row) {
      return null;
    }
    const [items, payments, history] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT * FROM school_quotation_items WHERE quotation_id = $1 ORDER BY line_no`,
        [id],
      ),
      this.dataSource.query<SqlRow[]>(
        `${PAYMENT_SELECT} WHERE p.quotation_id = $1 ORDER BY p.received_at, p.receipt_number`,
        [id],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT h.*, u.username AS created_by_username
           FROM school_list_history h JOIN users u ON u.id = h.created_by
          WHERE h.entity_type = 'QUOTATION' AND h.entity_id = $1 ORDER BY h.id DESC`,
        [id],
      ),
    ]);

    const summary = toSummary(row);
    let paidSoFar = 0;
    const account: AccountSummary = {
      total: summary.total,
      advances: 0,
      installments: 0,
      refunds: 0,
      paid: summary.paid,
      balance: summary.balance,
    };
    const paymentRows = payments.map((payment) => {
      paidSoFar = Math.round((paidSoFar + num(payment.effect)) * 100) / 100;
      if (payment.status === 'APLICADO') {
        if (payment.kind === 'ANTICIPO')
          account.advances += num(payment.amount);
        if (payment.kind === 'ABONO')
          account.installments += num(payment.amount);
        if (payment.kind === 'DEVOLUCION')
          account.refunds += num(payment.amount);
      }
      return toPayment(
        payment,
        Math.round((summary.total - paidSoFar) * 100) / 100,
      );
    });

    return {
      ...summary,
      subtotal: num(row.subtotal),
      discount: num(row.discount),
      observations: textOrNull(row.observations),
      updatedAt: text(row.updated_at),
      finishedAt: textOrNull(row.finished_at),
      finishedByUsername: textOrNull(row.finished_by_username),
      deliveredAt: textOrNull(row.delivered_at),
      deliveredByUsername: textOrNull(row.delivered_by_username),
      cancelledAt: textOrNull(row.cancelled_at),
      cancelledByUsername: textOrNull(row.cancelled_by_username),
      cancelReason: textOrNull(row.cancel_reason),
      items: items.map((item): QuotationItemRow => ({
        id: text(item.id),
        lineNo: num(item.line_no),
        source: text(item.source) as QuotationItemRow['source'],
        templateItemId: textOrNull(item.template_item_id),
        productId: textOrNull(item.product_id),
        productName: text(item.product_name),
        description: textOrNull(item.description),
        quantity: num(item.quantity),
        unitPrice: num(item.unit_price),
        discount: num(item.discount),
        subtotal: num(item.subtotal),
        observations: textOrNull(item.observations),
      })),
      payments: paymentRows,
      history: history.map((entry): HistoryRow => ({
        id: num(entry.id),
        action: text(entry.action),
        fromStatus: textOrNull(entry.from_status),
        toStatus: textOrNull(entry.to_status),
        details: (entry.details as Record<string, unknown>) ?? {},
        createdAt: text(entry.created_at),
        createdByUsername: text(entry.created_by_username),
      })),
      account,
    };
  }

  async createQuotation(
    input: QuotationInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT create_school_quotation($1::jsonb, $2, $3) AS id`,
      [JSON.stringify(input), userId, idempotencyKey],
    );
  }

  async updateQuotation(
    id: string,
    input: QuotationInput,
    userId: string,
    expectedVersion: number,
  ): Promise<string> {
    return this.scalar(
      `SELECT update_school_quotation($1, $2::jsonb, $3, $4) AS id`,
      [id, JSON.stringify(input), userId, expectedVersion],
    );
  }

  async setObservations(
    id: string,
    observations: string | null,
    userId: string,
    expectedVersion: number,
  ): Promise<string> {
    return this.scalar(
      `SELECT set_school_quotation_observations($1, $2, $3, $4) AS id`,
      [id, observations, userId, expectedVersion],
    );
  }

  async changeStatus(
    id: string,
    action: SchoolStatusAction,
    userId: string,
    expectedVersion: number | null,
  ): Promise<string> {
    return this.scalar(
      `SELECT change_school_quotation_status($1, $2, $3, $4) AS id`,
      [id, action, userId, expectedVersion],
    );
  }

  async cancelQuotation(
    id: string,
    input: CancelInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT cancel_school_quotation($1, $2, $3, $4, $5, $6, $7) AS id`,
      [
        id,
        input.reason,
        input.refundMethod ?? null,
        input.bankId ?? null,
        input.reference ?? null,
        userId,
        idempotencyKey,
      ],
    );
  }

  async registerPayment(
    quotationId: string,
    input: PaymentInput,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT register_school_quotation_payment($1, $2, $3, $4, $5, $6, $7, $8) AS id`,
      [
        quotationId,
        input.amount,
        input.paymentMethod,
        input.bankId ?? null,
        input.reference ?? null,
        input.observations ?? null,
        userId,
        idempotencyKey,
      ],
    );
  }

  async voidPayment(
    paymentId: string,
    reason: string,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT void_school_quotation_payment($1, $2, $3, $4) AS id`,
      [paymentId, reason, userId, idempotencyKey],
    );
  }

  async findPayment(paymentId: string): Promise<PaymentRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${PAYMENT_SELECT} WHERE p.id = $1`,
      [paymentId],
    );
    return row ? toPayment(row, num(row.balance_after)) : null;
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  async dashboard(dateFrom: string, dateTo: string): Promise<DashboardRow> {
    const range = [dateFrom, dateTo];
    const [totals] = await this.dataSource.query<SqlRow[]>(
      `WITH q AS (
         SELECT q.*, ${PAID_SQL} AS paid FROM school_quotations q
          WHERE q.quotation_date BETWEEN $1::date AND $2::date
       )
       SELECT count(*) AS total_quotations,
              count(*) FILTER (WHERE status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','EN_PREPARACION','TERMINADA')
                                 AND total > paid) AS pending_quotations,
              count(*) FILTER (WHERE status IN ('PAGADA','ENTREGADA')
                                 OR (status IN ('EN_PREPARACION','TERMINADA') AND total <= paid)) AS paid_quotations,
              COALESCE(SUM(total) FILTER (WHERE status NOT IN ('CANCELADA','BORRADOR')), 0) AS total_quoted,
              COALESCE(SUM(paid) FILTER (WHERE status <> 'CANCELADA'), 0) AS total_received,
              COALESCE(SUM(total - paid) FILTER (WHERE status NOT IN ('CANCELADA','BORRADOR','ENTREGADA')), 0) AS pending_balance
         FROM q`,
      range,
    );
    const [byGrade, byStatus, income] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT grade, count(*) AS count, COALESCE(SUM(total), 0) AS total
           FROM school_quotations
          WHERE quotation_date BETWEEN $1::date AND $2::date AND status <> 'CANCELADA'
          GROUP BY grade ORDER BY grade`,
        range,
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT status, count(*) AS count FROM school_quotations
          WHERE quotation_date BETWEEN $1::date AND $2::date GROUP BY status`,
        range,
      ),
      // Money by the day it moved: the original payment counts on its day and
      // its anulación/devolución subtracts on theirs.
      this.dataSource.query<SqlRow[]>(
        `SELECT (received_at AT TIME ZONE 'America/Guatemala')::date::text AS day,
                SUM(CASE WHEN kind IN ('ANTICIPO','ABONO') THEN amount ELSE -amount END) AS amount
           FROM school_quotation_payments
          WHERE (received_at AT TIME ZONE 'America/Guatemala')::date BETWEEN $1::date AND $2::date
          GROUP BY 1 ORDER BY 1`,
        range,
      ),
    ]);
    return {
      totalQuotations: num(totals.total_quotations),
      pendingQuotations: num(totals.pending_quotations),
      paidQuotations: num(totals.paid_quotations),
      totalQuoted: num(totals.total_quoted),
      totalReceived: num(totals.total_received),
      pendingBalance: num(totals.pending_balance),
      byGrade: byGrade.map((r) => ({
        grade: text(r.grade),
        count: num(r.count),
        total: num(r.total),
      })),
      byStatus: byStatus.map((r) => ({
        status: text(r.status) as SchoolQuotationStatus,
        count: num(r.count),
      })),
      incomeByDay: income.map((r) => ({
        date: text(r.day),
        amount: num(r.amount),
      })),
    };
  }

  /** Runs a writer function and returns its single `id` column, mapping its RAISE codes. */
  private async scalar(sql: string, params: unknown[]): Promise<string> {
    try {
      const [row] = await this.dataSource.query<SqlRow[]>(sql, params);
      return text(row.id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const mapped = schoolListErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
        // Malformed number/uuid/date that slipped past validation.
        const code = (error.driverError as { code?: string } | undefined)?.code;
        if (code === '22P02' || code === '22007' || code === '22008') {
          throw schoolListError('SCHOOL_INVALID_ITEMS');
        }
      }
      throw error;
    }
  }
}
