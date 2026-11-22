import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type {
  CashCountResult,
  CashStatementCount,
  CashStatementPeriod,
  CashStatementTotals,
} from '../../domain/cash-statement';
import type {
  CashStatementCut,
  CashStatementDay,
  CashStatementPeriodQuery,
  CashStatementRepository,
  CashStatementRow,
  CashStatementRowFilters,
  CashStatementRowPage,
} from '../../domain/repositories/cash-statement.repository';

type SqlRow = Record<string, unknown>;

const TZ = 'America/Guatemala';

function text(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }
  return JSON.stringify(value);
}
const num = (value: unknown): number =>
  value === null || value === undefined ? 0 : Number(value);
const numOrNull = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);
const str = (value: unknown): string | null =>
  value === null || value === undefined ? null : text(value);
const date = (value: unknown): Date | null =>
  value === null || value === undefined ? null : new Date(value as string);

/** Kardex table of each location. */
const KARDEX = {
  CAJA: 'cash_movements',
  BODEGA: 'warehouse_cash_movements',
} as const;

/** Balance after a sequence of a location's Kardex (0 before its first row). */
function balanceAt(table: string, sequenceSql: string): string {
  return `COALESCE((SELECT k.new_balance FROM ${table} k WHERE k.sequence <= ${sequenceSql}
                    ORDER BY k.sequence DESC LIMIT 1), 0)`;
}

/**
 * Physical rows of the Caja Kardex with their source operation. Direction NONE
 * (operations without physical effect, kept in the Kardex for display) never
 * appears in the statement.
 */
const CAJA_ROWS = `
  SELECT m.id, m.sequence, m.created_at, m.movement_type, om.movement_type AS original_movement_type,
         m.direction, m.amount, m.previous_balance, m.new_balance, m.description, m.reason,
         m.reference_type, m.reference_id, m.status, m.voided_at, m.void_reason, m.reversal_of_id,
         m.created_by, u.username, cp.period_number AS cut_period_number,
         CASE m.reference_type
           WHEN 'BANK_DEPOSIT' THEN COALESCE(NULLIF(btrim(bdo.description), ''), NULLIF(btrim(bdo.client_name), ''))
           WHEN 'ACCOUNT_RECEIVABLE' THEN ar_client.name
           WHEN 'ASSET' THEN asset_client.name
           WHEN 'WAREHOUSE_TRANSFER' THEN wt.received_by
           WHEN 'WAREHOUSE_WITHDRAWAL' THEN ww.delivered_by
           -- Manual entries, exits and adjustments: their reason says what the money was for.
           ELSE NULLIF(btrim(m.reason), '')
         END AS beneficiary,
         COALESCE(wt.reference_number, ww.reference_number, 'MOV-' || lpad(m.sequence::text, 6, '0')) AS operation_number,
         COALESCE(m.bank_name, wt.voucher_reference, ww.voucher_reference) AS reference
  FROM cash_movements m
  JOIN users u ON u.id = m.created_by
  LEFT JOIN cash_movements om ON om.id = m.reversal_of_id
  LEFT JOIN cash_cut_periods cp ON cp.id = m.cut_period_id
  LEFT JOIN bank_deposit_operations bdo ON m.reference_type = 'BANK_DEPOSIT' AND bdo.id = m.reference_id
  LEFT JOIN accounts_receivable ar ON m.reference_type = 'ACCOUNT_RECEIVABLE' AND ar.id = m.reference_id
  LEFT JOIN clients ar_client ON ar_client.id = ar.client_id
  LEFT JOIN assets ast ON m.reference_type = 'ASSET' AND ast.id = m.reference_id
  LEFT JOIN clients asset_client ON asset_client.id = ast.client_id
  LEFT JOIN cash_warehouse_transfers wt ON m.reference_type = 'WAREHOUSE_TRANSFER' AND wt.id = m.reference_id
  LEFT JOIN warehouse_cash_withdrawals ww ON m.reference_type = 'WAREHOUSE_WITHDRAWAL' AND ww.id = m.reference_id
  WHERE m.direction <> 'NONE' AND m.sequence > $1 AND ($2::bigint IS NULL OR m.sequence <= $2::bigint)
`;

/** Rows of the Bodega Kardex (always physical) with their source operation. */
const BODEGA_ROWS = `
  SELECT m.id, m.sequence, m.created_at, m.movement_type, om.movement_type AS original_movement_type,
         m.direction, m.amount, m.previous_balance, m.new_balance, m.description, m.reason,
         m.reference_type, m.reference_id, m.status, m.voided_at, m.void_reason, m.reversal_of_id,
         m.created_by, u.username, NULL::int AS cut_period_number,
         COALESCE(NULLIF(btrim(m.counterpart), ''), NULLIF(btrim(m.reason), '')) AS beneficiary,
         COALESCE(wt.reference_number, ww.reference_number, 'BOD-' || lpad(m.sequence::text, 6, '0')) AS operation_number,
         COALESCE(b.name, wt.voucher_reference, ww.voucher_reference) AS reference
  FROM warehouse_cash_movements m
  JOIN users u ON u.id = m.created_by
  LEFT JOIN warehouse_cash_movements om ON om.id = m.reversal_of_id
  LEFT JOIN cash_warehouse_transfers wt ON m.reference_type = 'WAREHOUSE_TRANSFER' AND wt.id = m.reference_id
  LEFT JOIN warehouse_cash_withdrawals ww ON m.reference_type = 'WAREHOUSE_WITHDRAWAL' AND ww.id = m.reference_id
  LEFT JOIN banks b ON b.id = ww.bank_id
  WHERE m.sequence > $1 AND ($2::bigint IS NULL OR m.sequence <= $2::bigint)
`;

/** Caja counts: Arqueos de Caja (VIGENTE and REEMPLAZADO) and the current count of each finished cut. */
const CAJA_COUNTS = `
  SELECT c.id, 'ARQUEO_CAJA' AS source, 'Arqueo de Caja #' || c.number AS number, c.counted_at,
         c.last_cash_sequence AS sequence, c.system_cash AS theoretical, c.total_counted AS counted,
         c.difference, c.result, c.status, u.username, c.observations
  FROM cash_counts c JOIN users u ON u.id = c.created_by
  UNION ALL
  SELECT k.id, 'CORTE', 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY'),
         k.created_at, p.closing_sequence, k.system_cash, k.total_counted, k.difference,
         CASE WHEN k.difference = 0 THEN 'CUADRADO' WHEN k.difference < 0 THEN 'FALTANTE' ELSE 'SOBRANTE' END,
         'VIGENTE', u.username, k.observations
  FROM cash_cut_counts k
  JOIN cash_cut_periods p ON p.id = k.cut_period_id
  JOIN cash_operational_days d ON d.id = p.operational_day_id
  JOIN users u ON u.id = k.created_by
  WHERE k.is_current AND p.status = 'FINALIZADO' AND p.closing_sequence IS NOT NULL
`;

/** Bodega counts: the Arqueos de Bodega (migration 1760009100000). */
const BODEGA_COUNTS = `
  SELECT a.id, 'ARQUEO_BODEGA' AS source, 'Arqueo de Bodega #' || a.number AS number, a.counted_at,
         a.warehouse_sequence AS sequence, a.theoretical_balance AS theoretical, a.total_counted AS counted,
         a.difference, a.result, 'VIGENTE'::text AS status, u.username, a.observations
  FROM warehouse_cash_audits a JOIN users u ON u.id = a.created_by
`;

function toCount(row: SqlRow): CashStatementCount {
  return {
    id: text(row.id),
    source: text(row.source) as CashStatementCount['source'],
    number: text(row.number),
    countedAt: date(row.counted_at)!,
    sequence: num(row.sequence),
    theoretical: num(row.theoretical),
    counted: num(row.counted),
    difference: num(row.difference),
    result: text(row.result) as CashCountResult,
    status: text(row.status) as CashStatementCount['status'],
    username: text(row.username),
    observations: str(row.observations),
  };
}

function toRow(row: SqlRow): CashStatementRow {
  return {
    id: text(row.id),
    sequence: num(row.sequence),
    operationNumber: text(row.operation_number),
    createdAt: date(row.created_at)!,
    movementType: text(row.movement_type),
    originalMovementType: str(row.original_movement_type),
    direction: text(row.direction) as CashStatementRow['direction'],
    amount: num(row.amount),
    previousBalance: num(row.previous_balance),
    newBalance: num(row.new_balance),
    description: text(row.description),
    beneficiary: str(row.beneficiary),
    reference: str(row.reference),
    referenceType: str(row.reference_type),
    referenceId: str(row.reference_id),
    status: text(row.status) as CashStatementRow['status'],
    voidedAt: date(row.voided_at),
    voidReason: str(row.void_reason),
    reversalOfId: str(row.reversal_of_id),
    username: text(row.username),
    cutPeriodNumber: numOrNull(row.cut_period_number),
  };
}

/** Escapes LIKE wildcards of a user search. */
function likeTerm(search: string): string {
  return search.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Raw-SQL adapter of the Estado de Cuenta de Efectivo. Read-only: every figure
 * comes from the official Kardex (`cash_movements`, `warehouse_cash_movements`),
 * the bank-day anchors (`cash_bank_day_openings`) and the stored counts. It
 * never writes, never stores a balance and never recomputes history.
 */
@Injectable()
export class TypeOrmCashStatementRepository implements CashStatementRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async resolvePeriod(
    query: CashStatementPeriodQuery,
  ): Promise<CashStatementPeriod | null> {
    if (query.dateFrom || query.dateTo) {
      const from = query.dateFrom ?? query.dateTo!;
      const to = query.dateTo ?? query.dateFrom!;
      return this.rangePeriod(query.location, from, to);
    }
    const [day] = await this.dataSource.query<SqlRow[]>(
      `WITH ordered AS (
         SELECT a.*, lead(a.opening_sequence) OVER w AS end_sequence, lead(a.opened_at) OVER w AS next_opened_at
         FROM cash_bank_day_openings a
         WINDOW w AS (ORDER BY a.opening_sequence, a.opened_at, a.business_date)
       )
       SELECT o.*, to_char(o.business_date, 'YYYY-MM-DD') AS business_date_text, u.username,
              CASE WHEN d.is_cancelled THEN 'CANCELADO' WHEN d.closed_at IS NULL THEN 'ABIERTO' ELSE 'CERRADO' END AS agent_status
       FROM ordered o
       JOIN day_openings d ON d.id = o.day_opening_id
       JOIN users u ON u.id = o.opened_by
       WHERE ($1::date IS NOT NULL AND o.business_date = $1::date)
          OR ($1::date IS NULL AND o.end_sequence IS NULL)
       ORDER BY o.opening_sequence DESC, o.opened_at DESC
       LIMIT 1`,
      [query.bankDate ?? null],
    );
    if (!day) {
      if (query.bankDate) {
        return null;
      }
      // No bank day opened yet: today (Guatemala) as a calendar range.
      const [today] = await this.dataSource.query<SqlRow[]>(
        `SELECT to_char((now() AT TIME ZONE '${TZ}')::date, 'YYYY-MM-DD') AS today`,
      );
      return this.rangePeriod(
        query.location,
        text(today.today),
        text(today.today),
      );
    }
    const businessDate = text(day.business_date_text);
    const windowStart = date(day.opened_at)!;
    const windowEnd = date(day.next_opened_at);
    const base = {
      kind: 'BANK_DAY' as const,
      location: query.location,
      businessDate,
      dateFrom: businessDate,
      dateTo: businessDate,
      windowStart,
      windowEnd,
      isCurrent: day.end_sequence === null,
      agentDayStatus: text(
        day.agent_status,
      ) as CashStatementPeriod['agentDayStatus'],
      openedByUsername: text(day.username),
    };
    if (query.location === 'CAJA') {
      return {
        ...base,
        startSequence: num(day.opening_sequence),
        endSequence: numOrNull(day.end_sequence),
        anchorOpeningBalance: num(day.opening_cash_balance),
        anchorSource: text(day.source) as CashStatementPeriod['anchorSource'],
      };
    }
    // Bodega has no anchor of its own: its rows written inside the bank-day window.
    const span = await this.sequenceSpan('BODEGA', windowStart, windowEnd);
    return { ...base, ...span, anchorOpeningBalance: null, anchorSource: null };
  }

  /** A Guatemala calendar range as a contiguous Kardex span. */
  private async rangePeriod(
    location: CashStatementPeriod['location'],
    from: string,
    to: string,
  ): Promise<CashStatementPeriod> {
    const [w] = await this.dataSource.query<SqlRow[]>(
      `SELECT ($1::date)::timestamp AT TIME ZONE '${TZ}' AS window_start,
              CASE WHEN (($2::date + 1)::timestamp AT TIME ZONE '${TZ}') > now() THEN NULL
                   ELSE (($2::date + 1)::timestamp AT TIME ZONE '${TZ}') END AS window_end`,
      [from, to],
    );
    const windowStart = date(w.window_start)!;
    const windowEnd = date(w.window_end);
    const span = await this.sequenceSpan(location, windowStart, windowEnd);
    return {
      kind: 'RANGE',
      location,
      businessDate: null,
      dateFrom: from,
      dateTo: to,
      windowStart,
      windowEnd,
      isCurrent: windowEnd === null,
      agentDayStatus: null,
      openedByUsername: null,
      anchorOpeningBalance: null,
      anchorSource: null,
      ...span,
    };
  }

  /**
   * Rows written in [start, end) as `start < sequence ≤ end` — contiguous by
   * construction, so opening + entries − exits always equals the closing.
   */
  private async sequenceSpan(
    location: CashStatementPeriod['location'],
    start: Date,
    end: Date | null,
  ): Promise<{ startSequence: number; endSequence: number | null }> {
    const table = KARDEX[location];
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT COALESCE((SELECT max(sequence) FROM ${table} WHERE created_at < $1), 0) AS start_sequence,
              CASE WHEN $2::timestamptz IS NULL THEN NULL
                   ELSE COALESCE((SELECT max(sequence) FROM ${table} WHERE created_at < $2::timestamptz), 0) END AS end_sequence`,
      [start, end],
    );
    const startSequence = num(row.start_sequence);
    const endSequence = numOrNull(row.end_sequence);
    return {
      startSequence,
      endSequence:
        endSequence === null ? null : Math.max(endSequence, startSequence),
    };
  }

  async getTotals(period: CashStatementPeriod): Promise<CashStatementTotals> {
    const table = KARDEX[period.location];
    const physical =
      period.location === 'CAJA' ? `direction <> 'NONE'` : 'TRUE';
    const toWarehouse =
      period.location === 'CAJA'
        ? `direction = 'OUT' AND movement_type = 'ENTREGA_BODEGA'`
        : `direction = 'IN' AND movement_type = 'ENTREGA_DESDE_CAJA'`;
    const fromWarehouse =
      period.location === 'CAJA'
        ? `direction = 'IN' AND movement_type = 'DEVOLUCION_BODEGA'`
        : `direction = 'OUT' AND movement_type = 'DEVOLUCION_A_CAJA'`;
    const params = [period.startSequence, period.endSequence];
    const [totals] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${balanceAt(table, '$1::bigint')} AS opening_balance,
              ${balanceAt(table, `COALESCE($2::bigint, (SELECT COALESCE(max(sequence), 0) FROM ${table}))`)} AS closing_balance,
              COALESCE(SUM(amount) FILTER (WHERE direction = 'IN'), 0) AS total_in,
              COALESCE(SUM(amount) FILTER (WHERE direction = 'OUT'), 0) AS total_out,
              count(*) FILTER (WHERE ${physical}) AS movement_count,
              COALESCE(SUM(amount) FILTER (WHERE ${toWarehouse}), 0) AS to_warehouse,
              COALESCE(SUM(amount) FILTER (WHERE ${fromWarehouse}), 0) AS from_warehouse
       FROM ${table}
       WHERE sequence > $1::bigint AND ($2::bigint IS NULL OR sequence <= $2::bigint)`,
      params,
    );
    const [last] = await this.dataSource.query<SqlRow[]>(
      `SELECT id, created_at, movement_type, direction, amount, description
       FROM ${table}
       WHERE ${physical} AND sequence > $1::bigint AND ($2::bigint IS NULL OR sequence <= $2::bigint)
       ORDER BY sequence DESC LIMIT 1`,
      params,
    );
    return {
      openingBalance: num(totals.opening_balance),
      totalIn: num(totals.total_in),
      totalOut: num(totals.total_out),
      movementCount: num(totals.movement_count),
      kardexClosingBalance: num(totals.closing_balance),
      toWarehouse: num(totals.to_warehouse),
      fromWarehouse: num(totals.from_warehouse),
      lastMovement: last
        ? {
            id: text(last.id),
            createdAt: date(last.created_at)!,
            movementType: text(last.movement_type),
            direction: text(last.direction) as 'IN' | 'OUT',
            amount: num(last.amount),
            description: text(last.description),
          }
        : null,
    };
  }

  async findRows(
    period: CashStatementPeriod,
    filters: CashStatementRowFilters,
    page: number,
    limit: number,
  ): Promise<CashStatementRowPage> {
    const params: unknown[] = [period.startSequence, period.endSequence];
    const where: string[] = [];
    // Every '?' of a clause is the same parameter.
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replaceAll('?', `$${params.length}`));
    };
    if (filters.direction) add('r.direction = ?', filters.direction);
    // A type also matches the annulments of that type.
    if (filters.movementType)
      add(
        '(r.movement_type = ? OR r.original_movement_type = ?)',
        filters.movementType,
      );
    if (filters.userId) add('r.created_by = ?::uuid', filters.userId);
    if (filters.search?.trim())
      add(
        `search_normalize(concat_ws(' ', r.description, r.beneficiary, r.operation_number, r.reference, r.reason))
           LIKE '%' || search_normalize(?) || '%'`,
        likeTerm(filters.search.trim()),
      );
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const source = period.location === 'CAJA' ? CAJA_ROWS : BODEGA_ROWS;
    const [totals] = await this.dataSource.query<SqlRow[]>(
      `WITH r AS (${source})
       SELECT count(*) AS total,
              COALESCE(SUM(r.amount) FILTER (WHERE r.direction = 'IN'), 0) AS total_in,
              COALESCE(SUM(r.amount) FILTER (WHERE r.direction = 'OUT'), 0) AS total_out
       FROM r ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `WITH r AS (${source})
       SELECT r.* FROM r ${whereSql}
       ORDER BY r.sequence ASC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit],
    );
    return {
      items: rows.map(toRow),
      total: num(totals.total),
      page,
      limit,
      filteredIn: num(totals.total_in),
      filteredOut: num(totals.total_out),
    };
  }

  async findCounts(period: CashStatementPeriod): Promise<CashStatementCount[]> {
    const source = period.location === 'CAJA' ? CAJA_COUNTS : BODEGA_COUNTS;
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT * FROM (${source}) c
       WHERE c.counted_at >= $1 AND ($2::timestamptz IS NULL OR c.counted_at < $2::timestamptz)
       ORDER BY c.counted_at ASC, c.sequence ASC`,
      [period.windowStart, period.windowEnd],
    );
    return rows.map(toCount);
  }

  async findPreviousCount(
    period: CashStatementPeriod,
  ): Promise<CashStatementCount | null> {
    const source = period.location === 'CAJA' ? CAJA_COUNTS : BODEGA_COUNTS;
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT * FROM (${source}) c
       WHERE c.status = 'VIGENTE' AND c.counted_at < $1
       ORDER BY c.counted_at DESC, c.sequence DESC LIMIT 1`,
      [period.windowStart],
    );
    return row ? toCount(row) : null;
  }

  async countMovementsAfter(
    period: CashStatementPeriod,
    sequence: number,
  ): Promise<number> {
    const table = KARDEX[period.location];
    const physical =
      period.location === 'CAJA' ? `direction <> 'NONE'` : 'TRUE';
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS n FROM ${table}
       WHERE ${physical} AND sequence > GREATEST($1::bigint, $3::bigint)
         AND ($2::bigint IS NULL OR sequence <= $2::bigint)`,
      [period.startSequence, period.endSequence, sequence],
    );
    return num(row?.n);
  }

  async findCuts(period: CashStatementPeriod): Promise<CashStatementCut[]> {
    if (period.location !== 'CAJA') {
      return [];
    }
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT p.id, p.period_number, p.status, p.actual_started_at, p.actual_finished_at,
              p.closing_system_cash, p.closing_physical_cash, p.cash_difference,
              p.closing_warehouse_balance, u.username AS closed_by_username, p.observations
       FROM cash_cut_periods p
       JOIN cash_operational_days d ON d.id = p.operational_day_id
       LEFT JOIN users u ON u.id = p.closed_by
       WHERE d.operational_date BETWEEN $1::date AND $2::date
       ORDER BY d.operational_date, p.period_number`,
      [period.dateFrom, period.dateTo],
    );
    return rows.map((row) => ({
      id: text(row.id),
      periodNumber: num(row.period_number),
      status: text(row.status),
      startedAt: date(row.actual_started_at),
      finishedAt: date(row.actual_finished_at),
      closingSystemCash: numOrNull(row.closing_system_cash),
      closingPhysicalCash: numOrNull(row.closing_physical_cash),
      cashDifference: numOrNull(row.cash_difference),
      closingWarehouseBalance: numOrNull(row.closing_warehouse_balance),
      closedByUsername: str(row.closed_by_username),
      observations: str(row.observations),
    }));
  }

  async getCustody(
    period: CashStatementPeriod,
  ): Promise<{ cash: number; warehouse: number }> {
    // The period's own location uses its official span end; the other one the window end.
    const atWindowEnd = (table: string, live: string) =>
      `CASE WHEN $1::timestamptz IS NULL THEN ${live}
            ELSE COALESCE((SELECT new_balance FROM ${table} WHERE created_at < $1::timestamptz
                           ORDER BY sequence DESC LIMIT 1), 0) END`;
    const cashSql =
      period.location === 'CAJA'
        ? `CASE WHEN $2::bigint IS NULL THEN cash_balance() ELSE cash_balance_at($2::bigint) END`
        : atWindowEnd('cash_movements', 'cash_balance()');
    const warehouseSql =
      period.location === 'BODEGA'
        ? `CASE WHEN $2::bigint IS NULL THEN warehouse_cash_balance()
                ELSE ${balanceAt('warehouse_cash_movements', '$2::bigint')} END`
        : atWindowEnd('warehouse_cash_movements', 'warehouse_cash_balance()');
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${cashSql} AS cash, ${warehouseSql} AS warehouse`,
      [period.windowEnd, period.endSequence],
    );
    return { cash: num(row.cash), warehouse: num(row.warehouse) };
  }

  async findDays(
    limit: number,
    withCounts: boolean,
  ): Promise<CashStatementDay[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `WITH ordered AS (
         SELECT a.*, lead(a.opening_sequence) OVER w AS end_sequence, lead(a.opened_at) OVER w AS next_opened_at
         FROM cash_bank_day_openings a
         WINDOW w AS (ORDER BY a.opening_sequence, a.opened_at, a.business_date)
       )
       SELECT to_char(o.business_date, 'YYYY-MM-DD') AS business_date, o.end_sequence IS NULL AS is_current,
              CASE WHEN d.is_cancelled THEN 'CANCELADO' WHEN d.closed_at IS NULL THEN 'ABIERTO' ELSE 'CERRADO' END AS agent_status,
              cash_balance_at(o.opening_sequence) AS opening_balance,
              CASE WHEN o.end_sequence IS NULL THEN cash_balance() ELSE cash_balance_at(o.end_sequence) END AS closing_balance,
              t.total_in, t.total_out, t.movement_count,
              c.number AS count_number, c.result AS count_result, c.difference AS count_difference,
              c.counted AS count_counted, c.counted_at AS count_at
       FROM ordered o
       JOIN day_openings d ON d.id = o.day_opening_id
       CROSS JOIN LATERAL (
         SELECT COALESCE(SUM(m.amount) FILTER (WHERE m.direction = 'IN'), 0) AS total_in,
                COALESCE(SUM(m.amount) FILTER (WHERE m.direction = 'OUT'), 0) AS total_out,
                count(*) FILTER (WHERE m.direction <> 'NONE') AS movement_count
         FROM cash_movements m
         WHERE m.sequence > o.opening_sequence AND (o.end_sequence IS NULL OR m.sequence <= o.end_sequence)
       ) t
       LEFT JOIN LATERAL (
         SELECT x.* FROM (${CAJA_COUNTS}) x
         WHERE $2::boolean AND x.status = 'VIGENTE' AND x.counted_at >= o.opened_at
           AND (o.next_opened_at IS NULL OR x.counted_at < o.next_opened_at)
         ORDER BY x.counted_at DESC, x.sequence DESC LIMIT 1
       ) c ON TRUE
       ORDER BY o.opening_sequence DESC, o.opened_at DESC
       LIMIT $1`,
      [limit, withCounts],
    );
    return rows.map((row) => ({
      businessDate: text(row.business_date),
      isCurrent: row.is_current === true,
      agentDayStatus: text(
        row.agent_status,
      ) as CashStatementDay['agentDayStatus'],
      openingBalance: num(row.opening_balance),
      totalIn: num(row.total_in),
      totalOut: num(row.total_out),
      closingBalance: num(row.closing_balance),
      movementCount: num(row.movement_count),
      lastCount:
        row.count_number === null || row.count_number === undefined
          ? null
          : {
              number: text(row.count_number),
              result: text(row.count_result) as CashCountResult,
              difference: num(row.count_difference),
              counted: num(row.count_counted),
              countedAt: date(row.count_at)!,
            },
    }));
  }
}
