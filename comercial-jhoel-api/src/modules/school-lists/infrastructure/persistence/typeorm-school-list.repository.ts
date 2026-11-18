import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  AccountSummary,
  CancelInput,
  DashboardRow,
  FindQuotationsOptions,
  HistoryRow,
  ItemAssignmentRow,
  ListInventoryMovementRow,
  PreparationAssignmentInput,
  DispatchRow,
  FindSupplyProductsOptions,
  QuotationSupplyRow,
  SupplyAllocationMode,
  SupplyAllocationRow,
  SupplyLineRow,
  SupplyProductListRow,
  SupplyProductRow,
  SupplyPurchaseRow,
  SupplySummary,
  Paginated,
  PaymentInput,
  PaymentRow,
  PurgeSummary,
  QuotationDetailRow,
  QuotationInput,
  QuotationItemRow,
  QuotationSortField,
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

/** Applied anticipos of a quotation (an annulled anticipo is ANULADO and does not count). */
const ADVANCE_SQL = `COALESCE((
  SELECT SUM(p.amount) FROM school_quotation_payments p
   WHERE p.quotation_id = q.id AND p.kind = 'ANTICIPO' AND p.status = 'APLICADO'), 0)`;

/**
 * ORDER BY expression per sortable column. Only these fixed strings reach the
 * SQL (the DTO whitelists the field), so the column is never user text.
 */
const QUOTATION_SORT_SQL: Record<QuotationSortField, string> = {
  number: 'q.quotation_number',
  customer: 'lower(q.customer_name)',
  grade: 'q.grade',
  date: 'q.quotation_date',
  total: 'q.total',
  balance: `(CASE WHEN q.status = 'CANCELADA' THEN 0 ELSE q.total - ${PAID_SQL} END)`,
  status: 'q.status',
};

/**
 * Product, SKU and category of a line, read from the live relation
 * products.category_id -> categories (LEFT JOIN: free-text lines have none).
 */
const LINE_PRODUCT_JOIN = `
  LEFT JOIN products lp ON lp.id = i.product_id
  LEFT JOIN categories lc ON lc.id = lp.category_id`;
const LINE_PRODUCT_COLUMNS = `lp.sku AS product_sku, lc.id AS category_id, lc.name AS category_name`;

/** Maps the LINE_PRODUCT_COLUMNS of a template or quotation line row. */
function lineProduct(row: SqlRow): {
  productSku: string | null;
  categoryId: string | null;
  categoryName: string | null;
} {
  return {
    productSku: textOrNull(row.product_sku),
    categoryId: textOrNull(row.category_id),
    categoryName: textOrNull(row.category_name),
  };
}

const QUOTATION_SELECT = `
  SELECT q.id, q.quotation_number, q.quotation_date::text AS quotation_date,
         q.delivery_date::text AS delivery_date, q.customer_name, q.customer_phone, q.student_name,
         q.grade, q.template_id, q.template_name, q.subtotal, q.discount, q.total, q.status, q.fulfillment_mode,
         q.version, q.observations, q.created_at, q.updated_at, q.finished_at, q.delivered_at, q.cancelled_at,
         q.cancel_reason, cu.username AS created_by_username, du.username AS delivered_by_username,
         xu.username AS cancelled_by_username, tu.username AS finished_by_username,
         q.confirmed_at, school_quotation_supply_status(q.id) AS supply_status, ${PAID_SQL} AS paid,
         ${ADVANCE_SQL} AS advance
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
    advance: num(row.advance),
    paid,
    balance,
    status,
    fulfillmentMode: text(
      row.fulfillment_mode,
    ) as QuotationSummaryRow['fulfillmentMode'],
    accountStatus: accountStatus(status, paid, balance),
    supplyStatus: text(
      row.supply_status,
    ) as QuotationSummaryRow['supplyStatus'],
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

function toPurgeSummary(value: unknown): PurgeSummary {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    quotations: num(row.quotations),
    payments: num(row.payments),
    movements: num(row.movements),
    allocations: num(row.allocations),
    dispatches: num(row.dispatches),
    returnedUnits: num(row.returnedUnits),
    returned: ((row.returned as SqlRow[] | undefined) ?? []).map((r) => ({
      productId: text(r.productId),
      product: text(r.product),
      units: num(r.units),
    })),
  };
}

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
      `SELECT i.*, CASE WHEN lp.is_active THEN lp.public_price END AS inventory_price, ${LINE_PRODUCT_COLUMNS}
         FROM school_list_template_items i ${LINE_PRODUCT_JOIN}
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
        ...lineProduct(item),
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
      // Customer, student or quotation number (one search box in the list).
      add(
        `(q.customer_name ILIKE ? OR q.student_name ILIKE $${params.length + 1} OR q.quotation_number ILIKE $${params.length + 1})`,
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
    if (options.supplyStatus) {
      add(`school_quotation_supply_status(q.id) = ?`, options.supplyStatus);
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
    const order = options.sortBy
      ? `${QUOTATION_SORT_SQL[options.sortBy]} ${options.sortDirection === 'asc' ? 'ASC' : 'DESC'},`
      : '';
    const rows = await this.dataSource.query<SqlRow[]>(
      `${QUOTATION_SELECT} ${filter}
        ORDER BY ${order} q.quotation_date DESC, q.created_at DESC
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
    const [items, assignments, payments, history, inventory, supply] =
      await Promise.all([
        this.dataSource.query<SqlRow[]>(
          `SELECT i.*, ${LINE_PRODUCT_COLUMNS}
           FROM school_quotation_items i ${LINE_PRODUCT_JOIN}
          WHERE i.quotation_id = $1 ORDER BY i.line_no`,
          [id],
        ),
        // Inventory products assigned in preparation, with their live Bodega stock.
        this.dataSource.query<SqlRow[]>(
          `SELECT a.*, p.name AS product_name, p.sku AS product_sku, c.name AS category_name,
                p.public_price, p.is_active AS product_active, COALESCE(s.quantity, 0) AS bodega_stock,
                cu.username AS created_by_username, uu.username AS updated_by_username
           FROM school_quotation_item_assignments a
           JOIN products p ON p.id = a.product_id
           LEFT JOIN categories c ON c.id = p.category_id
           LEFT JOIN inventory_locations l ON l.name = 'Bodega'
           LEFT JOIN inventory_stock s ON s.product_id = p.id AND s.location_id = l.id
           JOIN users cu ON cu.id = a.created_by
           LEFT JOIN users uu ON uu.id = a.updated_by
          WHERE a.quotation_id = $1
          ORDER BY a.created_at, p.name`,
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
        this.dataSource.query<SqlRow[]>(
          `SELECT m.id, m.product_id, p.name AS product_name, m.movement_type,
                m.quantity_base_units, m.reason, m.created_at, u.username
           FROM inventory_movements m
           JOIN products p ON p.id = m.product_id
           JOIN users u ON u.id = m.user_id
          WHERE m.reference_type = 'SCHOOL_LIST' AND m.reference_id = $1
          ORDER BY m.created_at, m.id`,
          [id],
        ),
        this.supplyOf(
          id,
          text(row.supply_status),
          textOrNull(row.confirmed_at),
        ),
      ]);

    const summary = toSummary(row);
    const assignmentsByItem = new Map<string, ItemAssignmentRow[]>();
    for (const a of assignments) {
      const list = assignmentsByItem.get(text(a.item_id)) ?? [];
      list.push({
        id: text(a.id),
        productId: text(a.product_id),
        productName: text(a.product_name),
        productSku: textOrNull(a.product_sku),
        categoryName: textOrNull(a.category_name),
        quantity: num(a.quantity),
        referencePrice: num(a.public_price),
        bodegaStock: num(a.bodega_stock),
        productActive: a.product_active === true,
        createdAt: text(a.created_at),
        createdByUsername: text(a.created_by_username),
        updatedAt: textOrNull(a.updated_at),
        updatedByUsername: textOrNull(a.updated_by_username),
      });
      assignmentsByItem.set(text(a.item_id), list);
    }
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
        ...lineProduct(item),
        assignments: assignmentsByItem.get(text(item.id)) ?? [],
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
      inventory: inventory.map((m) => ({
        id: text(m.id),
        productId: text(m.product_id),
        productName: text(m.product_name),
        movementType: text(
          m.movement_type,
        ) as ListInventoryMovementRow['movementType'],
        quantity: num(m.quantity_base_units),
        reason: textOrNull(m.reason),
        createdAt: text(m.created_at),
        username: text(m.username),
      })),
      supply,
      account,
    };
  }

  /** Supply section of a list: per-product commitment, reservations, deliveries and the dispatch. */
  private async supplyOf(
    id: string,
    status: string,
    confirmedAt: string | null,
  ): Promise<QuotationSupplyRow> {
    const [lines, uncontrolled, allocations, dispatches] = await Promise.all([
      this.dataSource.query<SqlRow[]>(
        `SELECT i.product_id, max(i.product_name) AS product_name, SUM(i.quantity)::int AS requested,
                COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                           WHERE a.quotation_id = $1 AND a.product_id = i.product_id AND a.status = 'ASIGNADA'), 0)::int AS allocated,
                COALESCE((SELECT SUM(di.delivered) FROM school_dispatch_items di
                            JOIN school_dispatches d ON d.id = di.dispatch_id
                           WHERE d.quotation_id = $1 AND di.product_id = i.product_id), 0)::int AS delivered
           FROM school_quotation_items i
          WHERE i.quotation_id = $1 AND i.product_id IS NOT NULL
          GROUP BY i.product_id ORDER BY 2`,
        [id],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT count(*)::int AS n FROM school_quotation_items WHERE quotation_id = $1 AND product_id IS NULL`,
        [id],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT a.*, p.name AS product_name, u.username, pu.invoice_number, pu.purchase_date
           FROM school_supply_allocations a
           JOIN products p ON p.id = a.product_id
           JOIN users u ON u.id = a.created_by
           LEFT JOIN purchases pu ON pu.id = a.purchase_id
          WHERE a.quotation_id = $1
          ORDER BY a.created_at, a.id`,
        [id],
      ),
      this.dataSource.query<SqlRow[]>(
        `SELECT d.*, u.username,
                (SELECT jsonb_agg(jsonb_build_object('productId', di.product_id, 'productName', di.product_name,
                        'requested', di.requested, 'supplied', di.supplied, 'delivered', di.delivered,
                        'inventoryControlled', di.inventory_controlled) ORDER BY di.product_name)
                   FROM school_dispatch_items di WHERE di.dispatch_id = d.id) AS items
           FROM school_dispatches d JOIN users u ON u.id = d.dispatched_by
          WHERE d.quotation_id = $1`,
        [id],
      ),
    ]);
    const dispatch = dispatches[0];
    return {
      status: status as QuotationSupplyRow['status'],
      confirmedAt,
      lines: lines.map((l): SupplyLineRow => {
        const requested = num(l.requested);
        const allocated = num(l.allocated);
        const delivered = num(l.delivered);
        return {
          productId: text(l.product_id),
          productName: text(l.product_name),
          requested,
          allocated,
          delivered,
          pending: Math.max(requested - allocated - delivered, 0),
        };
      }),
      uncontrolledLines: num(uncontrolled[0]?.n),
      allocations: allocations.map((a): SupplyAllocationRow => ({
        id: text(a.id),
        productId: text(a.product_id),
        productName: text(a.product_name),
        quantity: num(a.quantity),
        sourceType: text(a.source_type) as SupplyAllocationRow['sourceType'],
        mode: text(a.mode) as SupplyAllocationRow['mode'],
        status: text(a.status) as SupplyAllocationRow['status'],
        purchaseId: textOrNull(a.purchase_id),
        purchaseInvoice: textOrNull(a.invoice_number),
        purchaseDate: textOrNull(a.purchase_date),
        createdAt: text(a.created_at),
        username: text(a.username),
        releasedAt: textOrNull(a.released_at),
        releaseReason: textOrNull(a.release_reason),
      })),
      dispatch: dispatch
        ? {
            id: text(dispatch.id),
            dispatchedAt: text(dispatch.dispatched_at),
            username: text(dispatch.username),
            observations: textOrNull(dispatch.observations),
            items: (dispatch.items as DispatchRow['items']) ?? [],
          }
        : null,
    };
  }

  // ── Supply ─────────────────────────────────────────────────────────────
  async supplyProducts(
    options: FindSupplyProductsOptions,
  ): Promise<Paginated<SupplyProductRow> & { summary: SupplySummary }> {
    const params: unknown[] = [];
    const listFilter: string[] = [];
    const productFilter: string[] = [];
    const bind = (value: unknown) => {
      params.push(value);
      return `$${params.length}`;
    };
    if (options.quotationNumber) {
      listFilter.push(
        `c.quotation_number ILIKE ${bind(`%${options.quotationNumber}%`)}`,
      );
    }
    if (options.dateFrom) {
      listFilter.push(
        `(c.confirmed_at AT TIME ZONE 'America/Guatemala')::date >= ${bind(options.dateFrom)}::date`,
      );
    }
    if (options.dateTo) {
      listFilter.push(
        `(c.confirmed_at AT TIME ZONE 'America/Guatemala')::date <= ${bind(options.dateTo)}::date`,
      );
    }
    if (options.search) {
      const term = bind(`%${options.search}%`);
      productFilter.push(`(p.name ILIKE ${term} OR p.sku ILIKE ${term})`);
    }
    if (options.categoryId) {
      productFilter.push(`p.category_id = ${bind(options.categoryId)}`);
    }
    const rows = await this.dataSource.query<SqlRow[]>(
      `WITH c AS (
         SELECT * FROM school_supply_commitments c ${listFilter.length ? `WHERE ${listFilter.join(' AND ')}` : ''}
       ), agg AS (
         SELECT product_id, SUM(committed)::int AS committed, SUM(allocated)::int AS allocated,
                SUM(pending)::int AS pending, COUNT(DISTINCT quotation_id)::int AS lists,
                MIN(confirmed_at) AS first_order_at, MAX(confirmed_at) AS last_order_at,
                array_agg(DISTINCT quotation_id) FILTER (WHERE pending > 0) AS pending_lists
           FROM c GROUP BY product_id
       )
       SELECT agg.*, p.name AS product_name, p.sku, cat.name AS category,
              COALESCE((SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                         WHERE s.product_id = p.id AND l.name = 'Bodega'), 0) AS bodega,
              school_supply_free_units(p.id) AS free_units
         FROM agg
         JOIN products p ON p.id = agg.product_id
         JOIN categories cat ON cat.id = p.category_id
        ${productFilter.length ? `WHERE ${productFilter.join(' AND ')}` : ''}
        ORDER BY agg.pending DESC, p.name`,
      params,
    );
    const all = rows
      .map((r): SupplyProductRow => {
        const pending = num(r.pending);
        const allocated = num(r.allocated);
        return {
          productId: text(r.product_id),
          productName: text(r.product_name),
          sku: textOrNull(r.sku),
          category: text(r.category),
          bodega: num(r.bodega),
          committed: num(r.committed),
          allocated,
          pending,
          freeUnits: num(r.free_units),
          lists: num(r.lists),
          firstOrderAt: textOrNull(r.first_order_at),
          lastOrderAt: textOrNull(r.last_order_at),
          status:
            pending === 0
              ? 'ABASTECIDO'
              : allocated > 0
                ? 'PARCIAL'
                : 'PENDIENTE',
        };
      })
      .filter((r) => !options.status || r.status === options.status);
    // Lists with something still pending, per product (for "listas afectadas").
    const pendingLists = new Map(
      rows.map((r) => [
        text(r.product_id),
        ((r.pending_lists as string[] | null) ?? []).map(String),
      ]),
    );
    const summary: SupplySummary = {
      pendingProducts: all.filter((r) => r.pending > 0).length,
      pendingUnits: all.reduce((sum, r) => sum + r.pending, 0),
      affectedLists: new Set(
        all.flatMap((r) => pendingLists.get(r.productId) ?? []),
      ).size,
      suppliedProducts: all.filter((r) => r.status === 'ABASTECIDO').length,
      partialProducts: all.filter((r) => r.status === 'PARCIAL').length,
    };
    const start = (options.page - 1) * options.limit;
    return {
      items: all.slice(start, start + options.limit),
      total: all.length,
      page: options.page,
      limit: options.limit,
      summary,
    };
  }

  async supplyProductLists(productId: string): Promise<SupplyProductListRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT c.quotation_id, c.quotation_number, q.customer_name, q.grade, c.confirmed_at,
              c.committed, c.allocated, c.pending, school_quotation_supply_status(q.id) AS supply_status
         FROM school_supply_commitments c JOIN school_quotations q ON q.id = c.quotation_id
        WHERE c.product_id = $1
        ORDER BY c.confirmed_at NULLS LAST, c.quotation_number`,
      [productId],
    );
    return rows.map((r) => ({
      quotationId: text(r.quotation_id),
      quotationNumber: text(r.quotation_number),
      customerName: text(r.customer_name),
      grade: text(r.grade),
      confirmedAt: textOrNull(r.confirmed_at),
      committed: num(r.committed),
      allocated: num(r.allocated),
      pending: num(r.pending),
      supplyStatus: text(
        r.supply_status,
      ) as SupplyProductListRow['supplyStatus'],
    }));
  }

  async supplyPurchases(options: {
    purchaseId?: string;
    page: number;
    limit: number;
  }): Promise<Paginated<SupplyPurchaseRow>> {
    const where = options.purchaseId
      ? `pu.id = $1`
      : `EXISTS (SELECT 1 FROM school_supply_allocations x WHERE x.purchase_id = pu.id)`;
    const params: unknown[] = options.purchaseId ? [options.purchaseId] : [];
    const base = `
      FROM purchases pu
      JOIN inventory_movements m ON m.reference_type = 'PURCHASE' AND m.reference_id = pu.id
                                AND m.movement_type = 'ENTRADA_COMPRA'
      JOIN products pr ON pr.id = m.product_id
     WHERE ${where}`;
    const [{ count }] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*)::int AS count ${base}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT pu.id AS purchase_id, pu.invoice_number, pu.purchase_date, m.product_id, pr.name AS product_name,
              m.quantity_base_units AS purchased,
              COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                         WHERE a.source_movement_id = m.id AND a.status <> 'LIBERADA'), 0)::int AS allocated,
              COALESCE((SELECT jsonb_agg(jsonb_build_object('quotationId', q.id, 'quotationNumber', q.quotation_number,
                                'customerName', q.customer_name, 'quantity', a.quantity, 'status', a.status)
                                ORDER BY q.confirmed_at, q.quotation_number)
                          FROM school_supply_allocations a JOIN school_quotations q ON q.id = a.quotation_id
                         WHERE a.source_movement_id = m.id), '[]'::jsonb) AS lists
       ${base}
       ORDER BY pu.purchase_date DESC, pu.id, pr.name
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map((r) => ({
        purchaseId: text(r.purchase_id),
        invoiceNumber: textOrNull(r.invoice_number),
        purchaseDate: text(r.purchase_date),
        productId: text(r.product_id),
        productName: text(r.product_name),
        purchased: num(r.purchased),
        allocated: num(r.allocated),
        lists: (r.lists as SupplyPurchaseRow['lists']) ?? [],
      })),
      total: num(count),
      page: options.page,
      limit: options.limit,
    };
  }

  async supplyMode(): Promise<SupplyAllocationMode> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT allocation_mode FROM school_supply_settings WHERE id = 1`,
    );
    return text(row?.allocation_mode ?? 'FIFO_AUTO') as SupplyAllocationMode;
  }

  async setSupplyMode(
    mode: SupplyAllocationMode,
    userId: string,
  ): Promise<SupplyAllocationMode> {
    return (await this.scalar(`SELECT set_school_supply_mode($1, $2) AS id`, [
      mode,
      userId,
    ])) as SupplyAllocationMode;
  }

  async runFifo(productId: string | null, userId: string): Promise<number> {
    return Number(
      await this.scalar(`SELECT run_school_supply_fifo($1, $2) AS id`, [
        productId,
        userId,
      ]),
    );
  }

  async allocatePurchase(purchaseId: string, userId: string): Promise<number> {
    return Number(
      await this.scalar(
        `SELECT allocate_school_supply_purchase($1, $2) AS id`,
        [purchaseId, userId],
      ),
    );
  }

  async allocateManual(
    input: {
      quotationId: string;
      productId: string;
      quantity: number;
      purchaseId: string | null;
    },
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT allocate_school_supply_manual($1, $2, $3, $4, $5, $6) AS id`,
      [
        input.quotationId,
        input.productId,
        input.quantity,
        input.purchaseId,
        userId,
        idempotencyKey,
      ],
    );
  }

  async dispatch(
    quotationId: string,
    observations: string | null,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.scalar(
      `SELECT dispatch_school_quotation($1, $2, $3, $4) AS id`,
      [quotationId, userId, observations, idempotencyKey],
    );
  }

  async bodegaStock(
    productIds: string[],
  ): Promise<{ productId: string; quantity: number }[]> {
    if (!productIds.length) {
      return [];
    }
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT p.id AS product_id, COALESCE(s.quantity, 0) AS quantity
         FROM products p
         LEFT JOIN inventory_locations l ON l.name = 'Bodega'
         LEFT JOIN inventory_stock s ON s.product_id = p.id AND s.location_id = l.id
        WHERE p.id = ANY($1::uuid[])`,
      [productIds],
    );
    return rows.map((r) => ({
      productId: text(r.product_id),
      quantity: num(r.quantity),
    }));
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

  async savePreparation(
    id: string,
    assignments: PreparationAssignmentInput[],
    userId: string,
    expectedVersion: number,
  ): Promise<string> {
    return this.scalar(
      `SELECT save_school_quotation_preparation($1, $2::jsonb, $3, $4) AS id`,
      [id, JSON.stringify(assignments), userId, expectedVersion],
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
              count(*) FILTER (WHERE status IN ('BORRADOR','COTIZADA','ACEPTADA')) AS awaiting_quotations,
              count(*) FILTER (WHERE status IN ('COTIZADA','ACEPTADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','EN_PREPARACION','TERMINADA')
                                 AND total > paid) AS pending_quotations,
              count(*) FILTER (WHERE status IN ('PAGADA','ENTREGADA')
                                 OR (status IN ('ACEPTADA','EN_PREPARACION','TERMINADA') AND total <= paid)) AS paid_quotations,
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
      awaitingQuotations: num(totals.awaiting_quotations),
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

  // ── Purge ────────────────────────────────────────────────────────────────
  async purgePreview(): Promise<PurgeSummary> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `WITH b AS (SELECT id FROM inventory_locations WHERE name = 'Bodega'),
            r AS (
              SELECT m.product_id,
                     SUM(CASE WHEN m.location_from_id = b.id THEN m.quantity_base_units
                              WHEN m.location_to_id = b.id THEN -m.quantity_base_units ELSE 0 END)::int AS units
                FROM inventory_movements m CROSS JOIN b
               WHERE m.reference_type = 'SCHOOL_LIST'
               GROUP BY m.product_id)
       SELECT jsonb_build_object(
                'quotations', (SELECT count(*) FROM school_quotations),
                'payments', (SELECT count(*) FROM school_quotation_payments),
                'movements', (SELECT count(*) FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST'),
                'allocations', (SELECT count(*) FROM school_supply_allocations),
                'dispatches', (SELECT count(*) FROM school_dispatches),
                'returnedUnits', COALESCE((SELECT SUM(units) FROM r WHERE units <> 0), 0),
                'returned', COALESCE((SELECT jsonb_agg(jsonb_build_object('productId', r.product_id, 'product', p.name,
                                                                          'units', r.units) ORDER BY p.name)
                                        FROM r JOIN products p ON p.id = r.product_id WHERE r.units <> 0), '[]'::jsonb)
              ) AS summary`,
    );
    return toPurgeSummary(row.summary);
  }

  async purgeQuotations(
    userId: string,
    confirmation: string,
  ): Promise<PurgeSummary> {
    const summary = await this.scalar(
      `SELECT purge_school_quotations($1, $2)::text AS id`,
      [userId, confirmation],
    );
    return toPurgeSummary(JSON.parse(summary));
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
