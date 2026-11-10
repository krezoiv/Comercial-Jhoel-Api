import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  CashBalanceSnapshot,
  CashBankBalance,
  CashBankReconciliationRow,
  CashControlRepository,
  CashCountRow,
  CashCutDetail,
  CashCutEventRow,
  CashCutPeriodRow,
  CashDateSummary,
  CashDayHistoryRow,
  CashMovementRow,
  CashOperationalDayRow,
  CashRangeTotals,
  CashScheduleChangeRow,
  CashUserOption,
  FindCashDaysOptions,
  FindCashMovementsOptions,
  FinishCashCutData,
  OpenCashDayData,
  PaginatedCashDays,
  PaginatedCashMovements,
  RegisterCashBankDepositData,
  RegisterManualCashMovementData,
} from '../../domain/repositories/cash-control.repository';
import { cashControlErrorFromMessage } from '../../domain/errors/cash-control.errors';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';

type SqlRow = Record<string, unknown>;

/** Text of a SQL scalar (strings, numbers, booleans, dates); '' for null. */
function text(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return JSON.stringify(value);
}

function num(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function numOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function str(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

const MOVEMENT_COLUMNS = `
  m.id, m.sequence, to_char(m.operational_date, 'YYYY-MM-DD') AS operational_date,
  m.operational_day_id, m.cut_period_id, cp.period_number AS cut_period_number,
  m.movement_type, om.movement_type AS original_movement_type, m.direction, m.amount,
  m.previous_balance, m.new_balance, m.reference_type, m.reference_id, m.description,
  m.bank_name, m.reason, m.reversal_of_id, m.status, m.voided_at, vu.username AS voided_by_username,
  m.void_reason, m.created_by, cu.username AS created_by_username, m.created_at
`;
const MOVEMENT_FROM = `
  FROM cash_movements m
  JOIN users cu ON cu.id = m.created_by
  LEFT JOIN users vu ON vu.id = m.voided_by
  LEFT JOIN cash_movements om ON om.id = m.reversal_of_id
  LEFT JOIN cash_cut_periods cp ON cp.id = m.cut_period_id
`;

function toMovement(row: SqlRow): CashMovementRow {
  return {
    id: text(row.id),
    sequence: num(row.sequence),
    operationalDate: text(row.operational_date),
    operationalDayId: str(row.operational_day_id),
    cutPeriodId: str(row.cut_period_id),
    cutPeriodNumber: numOrNull(row.cut_period_number),
    movementType: row.movement_type as CashMovementRow['movementType'],
    originalMovementType:
      (row.original_movement_type as CashMovementRow['movementType']) ?? null,
    direction: row.direction as CashMovementRow['direction'],
    amount: num(row.amount),
    previousBalance: num(row.previous_balance),
    newBalance: num(row.new_balance),
    referenceType: str(row.reference_type),
    referenceId: str(row.reference_id),
    description: text(row.description),
    bankName: str(row.bank_name),
    reason: str(row.reason),
    reversalOfId: str(row.reversal_of_id),
    status: row.status as CashMovementRow['status'],
    voidedAt: (row.voided_at as Date) ?? null,
    voidedByUsername: str(row.voided_by_username),
    voidReason: str(row.void_reason),
    createdBy: text(row.created_by),
    createdByUsername: text(row.created_by_username),
    createdAt: row.created_at as Date,
  };
}

const DAY_COLUMNS = `
  d.id, to_char(d.operational_date, 'YYYY-MM-DD') AS operational_date, d.status, d.opening_policy,
  d.previous_day_id, d.previous_cut_id, d.previous_closing_physical_cash, d.previous_closing_system_cash,
  d.inherited_difference, d.opening_sequence, d.opening_system_cash, d.opening_physical_cash,
  d.opening_reason, d.opened_by, ou.username AS opened_by_username, d.opened_at,
  d.closing_system_cash, d.closing_physical_cash, d.closing_difference, d.total_in, d.total_out,
  d.movement_count, d.closing_observations, xu.username AS closed_by_username, d.closed_at
`;
const DAY_FROM = `
  FROM cash_operational_days d
  JOIN users ou ON ou.id = d.opened_by
  LEFT JOIN users xu ON xu.id = d.closed_by
`;

function toDay(row: SqlRow): CashOperationalDayRow {
  return {
    id: text(row.id),
    operationalDate: text(row.operational_date),
    status: row.status as CashOperationalDayRow['status'],
    openingPolicy: row.opening_policy as CashOperationalDayRow['openingPolicy'],
    previousDayId: str(row.previous_day_id),
    previousCutId: str(row.previous_cut_id),
    previousClosingPhysicalCash: numOrNull(row.previous_closing_physical_cash),
    previousClosingSystemCash: numOrNull(row.previous_closing_system_cash),
    inheritedDifference: num(row.inherited_difference),
    openingSequence: num(row.opening_sequence),
    openingSystemCash: num(row.opening_system_cash),
    openingPhysicalCash: num(row.opening_physical_cash),
    openingReason: str(row.opening_reason),
    openedBy: text(row.opened_by),
    openedByUsername: text(row.opened_by_username),
    openedAt: row.opened_at as Date,
    closingSystemCash: numOrNull(row.closing_system_cash),
    closingPhysicalCash: numOrNull(row.closing_physical_cash),
    closingDifference: numOrNull(row.closing_difference),
    totalIn: numOrNull(row.total_in),
    totalOut: numOrNull(row.total_out),
    movementCount: numOrNull(row.movement_count),
    closingObservations: str(row.closing_observations),
    closedByUsername: str(row.closed_by_username),
    closedAt: (row.closed_at as Date) ?? null,
  };
}

const PERIOD_COLUMNS = `
  p.id, p.operational_day_id, to_char(d.operational_date, 'YYYY-MM-DD') AS operational_date,
  p.period_number, p.status, p.scheduled_start_at, p.scheduled_end_at, p.actual_started_at,
  p.actual_finished_at, p.start_sequence, p.closing_sequence, p.opening_system_cash,
  p.opening_physical_cash, p.inherited_difference, p.closing_system_cash, p.closing_physical_cash,
  p.cash_difference, p.total_in, p.total_out, p.movement_count, p.opening_bank_balances,
  pou.username AS opened_by_username, pcu.username AS closed_by_username, p.observations,
  p.reopened_count, br.bank_difference_total, br.bank_reconciled_count
`;
const PERIOD_FROM = `
  FROM cash_cut_periods p
  JOIN cash_operational_days d ON d.id = p.operational_day_id
  LEFT JOIN users pou ON pou.id = p.opened_by
  LEFT JOIN users pcu ON pcu.id = p.closed_by
  LEFT JOIN LATERAL (
    SELECT SUM(r.difference) AS bank_difference_total, count(*) AS bank_reconciled_count
    FROM cash_cut_bank_reconciliations r
    JOIN cash_cut_counts c ON c.id = r.count_id AND c.is_current
    WHERE r.cut_period_id = p.id AND p.status = 'FINALIZADO'
  ) br ON true
`;

function toBankBalances(value: unknown): CashBankBalance[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  return (value as SqlRow[]).map((row) => ({
    bankId: text(row.bankId),
    bankName: text(row.bankName),
    accountNumber: str(row.accountNumber),
    specialAccount: str(row.specialAccount),
    balance: num(row.balance),
  }));
}

function toPeriod(row: SqlRow): CashCutPeriodRow {
  return {
    id: text(row.id),
    operationalDayId: text(row.operational_day_id),
    operationalDate: text(row.operational_date),
    periodNumber: num(row.period_number) as 1 | 2,
    status: row.status as CashCutPeriodRow['status'],
    scheduledStartAt: row.scheduled_start_at as Date,
    scheduledEndAt: row.scheduled_end_at as Date,
    actualStartedAt: (row.actual_started_at as Date) ?? null,
    actualFinishedAt: (row.actual_finished_at as Date) ?? null,
    startSequence: numOrNull(row.start_sequence),
    closingSequence: numOrNull(row.closing_sequence),
    openingSystemCash: numOrNull(row.opening_system_cash),
    openingPhysicalCash: numOrNull(row.opening_physical_cash),
    inheritedDifference: numOrNull(row.inherited_difference),
    closingSystemCash: numOrNull(row.closing_system_cash),
    closingPhysicalCash: numOrNull(row.closing_physical_cash),
    cashDifference: numOrNull(row.cash_difference),
    totalIn: numOrNull(row.total_in),
    totalOut: numOrNull(row.total_out),
    movementCount: numOrNull(row.movement_count),
    openingBankBalances: toBankBalances(row.opening_bank_balances),
    openedByUsername: str(row.opened_by_username),
    closedByUsername: str(row.closed_by_username),
    observations: str(row.observations),
    reopenedCount: num(row.reopened_count),
    bankDifferenceTotal: numOrNull(row.bank_difference_total),
    bankReconciledCount: numOrNull(row.bank_reconciled_count),
  };
}

/**
 * Raw-SQL adapter over the Control de Efectivo functions/tables. Reads are
 * plain SELECTs; every write is ONE call to a SQL function that takes the
 * `cash_control_main` advisory lock and validates under it, so the balance
 * can never be computed from stale data. SQL `RAISE`s are translated to
 * domain errors via `cashControlErrorFromMessage`.
 */
@Injectable()
export class TypeOrmCashControlRepository implements CashControlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private async write<T>(sql: string, params: unknown[]): Promise<T> {
    try {
      return await this.dataSource.query<T>(sql, params);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // Cash rules first; a bank deposit can also hit the bank account's own rules.
        const mapped =
          cashControlErrorFromMessage(error.message) ??
          bankMovementErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
      }
      throw error;
    }
  }

  async getBalance(): Promise<CashBalanceSnapshot> {
    const [row] = await this.dataSource.query<SqlRow[]>(`
      SELECT new_balance, sequence, created_at FROM cash_movements ORDER BY sequence DESC LIMIT 1
    `);
    return {
      balance: row ? num(row.new_balance) : 0,
      lastSequence: row ? num(row.sequence) : 0,
      lastMovementAt: row ? (row.created_at as Date) : null,
    };
  }

  async getDateSummary(date: string): Promise<CashDateSummary> {
    const [opening] = await this.dataSource.query<SqlRow[]>(
      `SELECT cash_balance_at(COALESCE((SELECT max(sequence) FROM cash_movements WHERE operational_date < $1::date), 0)) AS balance`,
      [date],
    );
    const buckets = await this.dataSource.query<SqlRow[]>(
      `SELECT movement_type,
              COALESCE(SUM(amount) FILTER (WHERE direction = 'IN'), 0) AS total_in,
              COALESCE(SUM(amount) FILTER (WHERE direction = 'OUT'), 0) AS total_out,
              count(*) AS count
       FROM cash_movements WHERE operational_date = $1::date
       GROUP BY movement_type`,
      [date],
    );
    const mapped = buckets.map((row) => ({
      movementType: row.movement_type as CashMovementRow['movementType'],
      totalIn: num(row.total_in),
      totalOut: num(row.total_out),
      count: num(row.count),
    }));
    return {
      openingBalance: num(opening?.balance),
      totalIn: mapped.reduce((sum, b) => sum + b.totalIn, 0),
      totalOut: mapped.reduce((sum, b) => sum + b.totalOut, 0),
      movementCount: mapped.reduce((sum, b) => sum + b.count, 0),
      buckets: mapped,
    };
  }

  async getRangeTotals(
    afterSequence: number,
    upToSequence: number | null,
  ): Promise<CashRangeTotals> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT COALESCE(SUM(amount) FILTER (WHERE direction = 'IN'), 0) AS total_in,
              COALESCE(SUM(amount) FILTER (WHERE direction = 'OUT'), 0) AS total_out,
              count(*) AS movement_count
       FROM cash_movements
       WHERE sequence > $1 AND ($2::bigint IS NULL OR sequence <= $2::bigint)`,
      [afterSequence, upToSequence],
    );
    return {
      totalIn: num(row?.total_in),
      totalOut: num(row?.total_out),
      movementCount: num(row?.movement_count),
    };
  }

  async hasInitialBalance(): Promise<boolean> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT EXISTS (SELECT 1 FROM cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE') AS exists`,
    );
    return Boolean(row?.exists);
  }

  async findMovements(
    options: FindCashMovementsOptions,
  ): Promise<PaginatedCashMovements> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replace('?', `$${params.length}`));
    };
    if (options.dateFrom)
      add('m.operational_date >= ?::date', options.dateFrom);
    if (options.dateTo) add('m.operational_date <= ?::date', options.dateTo);
    if (options.movementType) add('m.movement_type = ?', options.movementType);
    if (options.direction) add('m.direction = ?', options.direction);
    if (options.userId) add('m.created_by = ?::uuid', options.userId);
    if (options.cutPeriodId)
      add('m.cut_period_id = ?::uuid', options.cutPeriodId);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [totals] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total,
              COALESCE(SUM(m.amount) FILTER (WHERE m.direction = 'IN'), 0) AS total_in,
              COALESCE(SUM(m.amount) FILTER (WHERE m.direction = 'OUT'), 0) AS total_out
       FROM cash_movements m ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM} ${whereSql}
       ORDER BY m.sequence DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map(toMovement),
      total: num(totals?.total),
      page: options.page,
      limit: options.limit,
      totalIn: num(totals?.total_in),
      totalOut: num(totals?.total_out),
    };
  }

  async findRecentMovements(limit: number): Promise<CashMovementRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM} ORDER BY m.sequence DESC LIMIT $1`,
      [limit],
    );
    return rows.map(toMovement);
  }

  async findMovementById(id: string): Promise<CashMovementRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM} WHERE m.id = $1`,
      [id],
    );
    if (!row) {
      return null;
    }
    const details = await this.dataSource.query<SqlRow[]>(
      `SELECT denomination, quantity, subtotal FROM cash_movement_details
       WHERE movement_id = $1 ORDER BY denomination DESC`,
      [id],
    );
    return {
      ...toMovement(row),
      details: details.map((detail) => ({
        denomination: num(detail.denomination),
        quantity: num(detail.quantity),
        subtotal: num(detail.subtotal),
      })),
    };
  }

  async registerBankDeposit(
    data: RegisterCashBankDepositData,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_cash_bank_deposit($1, $2, $3::jsonb, $4, $5, $6) AS id`,
      [
        data.bankId,
        data.amount,
        JSON.stringify(data.details),
        data.userId,
        data.description,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async findMovementsByReference(
    referenceType: string,
    referenceId: string,
  ): Promise<CashMovementRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM}
       WHERE m.reference_type = $1 AND m.reference_id = $2 ORDER BY m.sequence`,
      [referenceType, referenceId],
    );
    return rows.map(toMovement);
  }

  async findUsers(): Promise<CashUserOption[]> {
    const rows = await this.dataSource.query<SqlRow[]>(`
      SELECT DISTINCT u.id, u.username FROM users u
      WHERE u.id IN (
        SELECT created_by FROM cash_movements
        UNION SELECT opened_by FROM cash_cut_periods WHERE opened_by IS NOT NULL
        UNION SELECT closed_by FROM cash_cut_periods WHERE closed_by IS NOT NULL
        UNION SELECT opened_by FROM cash_operational_days
      )
      ORDER BY u.username
    `);
    return rows.map((row) => ({
      id: text(row.id),
      username: text(row.username),
    }));
  }

  async registerManualMovement(
    data: RegisterManualCashMovementData,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_manual_cash_movement($1, $2, $3, $4, $5, $6) AS id`,
      [
        data.movementType,
        data.amount,
        data.userId,
        data.description,
        data.reason,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async voidManualMovement(
    id: string,
    userId: string,
    reason: string,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT void_manual_cash_movement($1, $2, $3) AS id`,
      [id, userId, reason],
    );
    return text(row.id);
  }

  async findDayByDate(date: string): Promise<CashOperationalDayRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${DAY_COLUMNS} ${DAY_FROM} WHERE d.operational_date = $1::date`,
      [date],
    );
    return row ? toDay(row) : null;
  }

  async findDayById(id: string): Promise<CashOperationalDayRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${DAY_COLUMNS} ${DAY_FROM} WHERE d.id = $1`,
      [id],
    );
    return row ? toDay(row) : null;
  }

  async findPeriodsByDay(dayId: string): Promise<CashCutPeriodRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT ${PERIOD_COLUMNS} ${PERIOD_FROM} WHERE p.operational_day_id = $1 ORDER BY p.period_number`,
      [dayId],
    );
    return rows.map(toPeriod);
  }

  async findOpenPeriod(): Promise<CashCutPeriodRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${PERIOD_COLUMNS} ${PERIOD_FROM} WHERE p.status = 'ABIERTO' LIMIT 1`,
    );
    return row ? toPeriod(row) : null;
  }

  async findPeriodById(id: string): Promise<CashCutPeriodRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT ${PERIOD_COLUMNS} ${PERIOD_FROM} WHERE p.id = $1`,
      [id],
    );
    return row ? toPeriod(row) : null;
  }

  async getBankBalances(): Promise<CashBankBalance[]> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT cash_bank_balances_snapshot() AS banks`,
    );
    return toBankBalances(row?.banks) ?? [];
  }

  async openDay(data: OpenCashDayData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT open_cash_operational_day($1::date, $2, $3, $4, $5::time, $6::time, $7::time, $8::time) AS id`,
      [
        data.date,
        data.userId,
        data.manualPhysicalCash,
        data.reason,
        data.firstStart,
        data.firstEnd,
        data.secondStart,
        data.secondEnd,
      ],
    );
    return text(row.id);
  }

  async updateSchedule(
    periodId: string,
    start: string,
    end: string,
    reason: string,
    userId: string,
  ): Promise<void> {
    await this.write(
      `SELECT update_cash_cut_schedule($1, $2::time, $3::time, $4, $5)`,
      [periodId, start, end, reason, userId],
    );
  }

  async startPeriod(periodId: string, userId: string): Promise<void> {
    await this.write(`SELECT start_cash_cut_period($1, $2)`, [
      periodId,
      userId,
    ]);
  }

  async finishPeriod(data: FinishCashCutData): Promise<void> {
    await this.write(
      `SELECT finish_cash_cut_period($1, $2, $3::jsonb, $4::jsonb, $5, $6)`,
      [
        data.periodId,
        data.userId,
        JSON.stringify(data.details),
        JSON.stringify(data.banks),
        data.cashObservations,
        data.observations,
      ],
    );
  }

  async reopenPeriod(
    periodId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    await this.write(`SELECT reopen_cash_cut_period($1, $2, $3)`, [
      periodId,
      userId,
      reason,
    ]);
  }

  async closeDay(
    dayId: string,
    userId: string,
    observations: string | null,
  ): Promise<void> {
    await this.write(`SELECT close_cash_operational_day($1, $2, $3)`, [
      dayId,
      userId,
      observations,
    ]);
  }

  async findDays(options: FindCashDaysOptions): Promise<PaginatedCashDays> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replace(/\?/g, `$${params.length}`));
    };
    if (options.dateFrom)
      add('d.operational_date >= ?::date', options.dateFrom);
    if (options.dateTo) add('d.operational_date <= ?::date', options.dateTo);
    // CERRADO and a bare ABIERTO describe the DAY; with a period filter (or
    // PROGRAMADO/FINALIZADO) the status/period filter applies to the cuts.
    const filtersCuts =
      !!options.periodNumber ||
      (options.status !== undefined &&
        options.status !== 'CERRADO' &&
        options.status !== 'ABIERTO');
    if (filtersCuts) {
      const clauses = ['f.operational_day_id = d.id'];
      if (options.status && options.status !== 'CERRADO') {
        params.push(options.status);
        clauses.push(`f.status = $${params.length}`);
      }
      if (options.periodNumber) {
        params.push(options.periodNumber);
        clauses.push(`f.period_number = $${params.length}`);
      }
      where.push(
        `EXISTS (SELECT 1 FROM cash_cut_periods f WHERE ${clauses.join(' AND ')})`,
      );
      if (options.status === 'CERRADO') {
        add('d.status = ?', 'CERRADO');
      }
    } else if (options.status) {
      add('d.status = ?', options.status);
    }
    if (options.userId) {
      add(
        `(d.opened_by = ?::uuid OR d.closed_by = ?::uuid OR EXISTS (
           SELECT 1 FROM cash_cut_periods f WHERE f.operational_day_id = d.id
             AND (f.opened_by = ?::uuid OR f.closed_by = ?::uuid)))`,
        options.userId,
      );
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM cash_operational_days d ${whereSql}`,
      params,
    );
    const dayRows = await this.dataSource.query<SqlRow[]>(
      `SELECT ${DAY_COLUMNS} ${DAY_FROM} ${whereSql}
       ORDER BY d.operational_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    const days = dayRows.map(toDay);
    const periodRows = days.length
      ? await this.dataSource.query<SqlRow[]>(
          `SELECT ${PERIOD_COLUMNS} ${PERIOD_FROM} WHERE p.operational_day_id = ANY($1::uuid[]) ORDER BY p.period_number`,
          [days.map((day) => day.id)],
        )
      : [];
    const periods = periodRows.map(toPeriod);
    const items: CashDayHistoryRow[] = days.map((day) => ({
      day,
      periods: periods.filter((period) => period.operationalDayId === day.id),
    }));
    return {
      items,
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  async findCutDetail(periodId: string): Promise<CashCutDetail | null> {
    const period = await this.findPeriodById(periodId);
    if (!period) {
      return null;
    }
    const day = await this.findDayById(period.operationalDayId);
    if (!day) {
      return null;
    }
    const countRows = await this.dataSource.query<SqlRow[]>(
      `SELECT c.id, c.total_counted, c.system_cash, c.difference, c.observations, c.is_current,
              u.username AS created_by_username, c.created_at
       FROM cash_cut_counts c JOIN users u ON u.id = c.created_by
       WHERE c.cut_period_id = $1 ORDER BY c.created_at DESC`,
      [periodId],
    );
    const detailRows = countRows.length
      ? await this.dataSource.query<SqlRow[]>(
          `SELECT count_id, denomination, quantity, subtotal FROM cash_cut_count_details
           WHERE count_id = ANY($1::uuid[]) ORDER BY denomination DESC`,
          [countRows.map((row) => row.id)],
        )
      : [];
    const counts: CashCountRow[] = countRows.map((row) => ({
      id: text(row.id),
      totalCounted: num(row.total_counted),
      systemCash: num(row.system_cash),
      difference: num(row.difference),
      observations: str(row.observations),
      isCurrent: Boolean(row.is_current),
      createdByUsername: text(row.created_by_username),
      createdAt: row.created_at as Date,
      details: detailRows
        .filter((detail) => detail.count_id === row.id)
        .map((detail) => ({
          denomination: num(detail.denomination),
          quantity: num(detail.quantity),
          subtotal: num(detail.subtotal),
        })),
    }));
    const bankRows = await this.dataSource.query<SqlRow[]>(
      `SELECT id, count_id, bank_id, bank_name, system_balance, verified_balance, difference, observations, created_at
       FROM cash_cut_bank_reconciliations WHERE cut_period_id = $1 ORDER BY created_at DESC, bank_name`,
      [periodId],
    );
    const bankReconciliations: CashBankReconciliationRow[] = bankRows.map(
      (row) => ({
        id: text(row.id),
        countId: text(row.count_id),
        bankId: text(row.bank_id),
        bankName: text(row.bank_name),
        systemBalance: num(row.system_balance),
        verifiedBalance: num(row.verified_balance),
        difference: num(row.difference),
        observations: str(row.observations),
        createdAt: row.created_at as Date,
      }),
    );
    const eventRows = await this.dataSource.query<SqlRow[]>(
      `SELECT e.id, e.action, e.reason, u.username, e.performed_at
       FROM cash_cut_events e JOIN users u ON u.id = e.performed_by
       WHERE e.cut_period_id = $1 ORDER BY e.performed_at`,
      [periodId],
    );
    const events: CashCutEventRow[] = eventRows.map((row) => ({
      id: text(row.id),
      action: row.action as CashCutEventRow['action'],
      reason: str(row.reason),
      performedByUsername: text(row.username),
      performedAt: row.performed_at as Date,
    }));
    const scheduleRows = await this.dataSource.query<SqlRow[]>(
      `SELECT s.id, s.previous_start_at, s.previous_end_at, s.new_start_at, s.new_end_at, s.reason,
              u.username, s.changed_at
       FROM cash_cut_schedule_changes s JOIN users u ON u.id = s.changed_by
       WHERE s.cut_period_id = $1 ORDER BY s.changed_at`,
      [periodId],
    );
    const scheduleChanges: CashScheduleChangeRow[] = scheduleRows.map(
      (row) => ({
        id: text(row.id),
        previousStartAt: row.previous_start_at as Date,
        previousEndAt: row.previous_end_at as Date,
        newStartAt: row.new_start_at as Date,
        newEndAt: row.new_end_at as Date,
        reason: text(row.reason),
        changedByUsername: text(row.username),
        changedAt: row.changed_at as Date,
      }),
    );
    // The cut covers the Kardex range (start_sequence, closing_sequence] — live upper bound while open.
    const movements =
      period.startSequence === null
        ? []
        : (
            await this.dataSource.query<SqlRow[]>(
              `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM}
             WHERE m.sequence > $1 AND ($2::bigint IS NULL OR m.sequence <= $2::bigint)
             ORDER BY m.sequence DESC LIMIT 500`,
              [period.startSequence, period.closingSequence],
            )
          ).map(toMovement);
    return {
      period,
      day,
      counts,
      bankReconciliations,
      events,
      scheduleChanges,
      movements,
    };
  }
}
