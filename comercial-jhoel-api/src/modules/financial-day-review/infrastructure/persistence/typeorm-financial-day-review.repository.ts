import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import {
  AdjacentMovementRaw,
  AdjustMovementData,
  AdjustmentRaw,
  AgentDayRaw,
  CashCutRaw,
  CashDayRaw,
  CloseSessionData,
  CorrectSnapshotData,
  CorrectionRow,
  DayBankMovementRaw,
  DayBankRaw,
  DayCashMovementRaw,
  DayTransactionRaw,
  FinancialDayListRow,
  FinancialDayRawData,
  FinancialDayReviewRepository,
  PhotographSummary,
  PortfolioClientRaw,
  PortfolioLateRowRaw,
  PortfolioRaw,
  PortfolioRowRaw,
  ReconciliationRaw,
  ReviewModule,
  ReviewSessionRow,
  ReviewSessionStatus,
} from '../../domain/repositories/financial-day-review.repository';
import {
  financialDayReviewError,
  financialDayReviewErrorFromMessage,
} from '../../domain/errors/financial-day-review.errors';

type SqlRow = Record<string, unknown>;

function str(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return JSON.stringify(value);
}

function strOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : str(value);
}

function num(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function numOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function date(value: unknown): Date {
  return value instanceof Date ? value : new Date(str(value));
}

function dateOrNull(value: unknown): Date | null {
  return value === null || value === undefined ? null : date(value);
}

/** Portfolio tables share one shape; the name is whitelisted, never user input. */
type PortfolioTable = 'accounts_receivable' | 'assets';

const SESSION_SELECT = `
  SELECT s.*, to_char(s.review_date, 'YYYY-MM-DD') AS review_date_text,
         ou.username AS opened_by_username, cu.username AS closed_by_username
  FROM financial_day_review_sessions s
  JOIN users ou ON ou.id = s.opened_by
  LEFT JOIN users cu ON cu.id = s.closed_by
`;

const PORTFOLIO_ROW_COLUMNS = `
  t.id, t.sequence, t.client_id, c.name AS client_name, to_char(t.date, 'YYYY-MM-DD') AS date_text,
  t.amount, t.movement_type, t.description, t.reference_type, t.is_active, t.created_at, t.updated_at,
  u.username
`;

/**
 * Raw-SQL adapter of "Revisión de días operativos". Reads are plain SELECTs
 * scoped to one date; every write is one call to the migration's PostgreSQL
 * functions (which lock, validate the day, audit and version), so nothing in
 * this class can modify a row of another day.
 */
@Injectable()
export class TypeOrmFinancialDayReviewRepository implements FinancialDayReviewRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async listDays(from: string, to: string): Promise<FinancialDayListRow[]> {
    const rows: SqlRow[] = await this.dataSource.query(
      `
      WITH days AS (
        SELECT date AS d FROM day_openings WHERE date BETWEEN $1 AND $2
        UNION SELECT operational_date FROM cash_operational_days WHERE operational_date BETWEEN $1 AND $2
        UNION SELECT operation_date FROM bank_balances WHERE operation_date BETWEEN $1 AND $2
        UNION SELECT date FROM agent_reconciliations WHERE date BETWEEN $1 AND $2
      )
      SELECT to_char(days.d, 'YYYY-MM-DD') AS day,
        CASE WHEN o.id IS NULL THEN NULL WHEN o.is_cancelled THEN 'CANCELADO'
             WHEN o.closed_at IS NULL THEN 'ABIERTO' ELSE 'CERRADO' END AS agent_status,
        cd.status AS cash_status, cd.opening_physical_cash, cd.closing_physical_cash, cd.closing_difference,
        r.total_cash, r.total_banks, r.total_accounts_receivable, r.total_assets, r.result,
        (SELECT count(*) FROM bank_account_movements WHERE business_date = days.d)
          + (SELECT count(*) FROM bank_deposit_operations WHERE operation_date = days.d)
          + (SELECT count(*) FROM cash_movements WHERE operational_date = days.d)
          + (SELECT count(*) FROM accounts_receivable WHERE date = days.d)
          + (SELECT count(*) FROM assets WHERE date = days.d) AS movement_count,
        (SELECT count(*) FROM cash_cut_periods p WHERE p.operational_day_id = cd.id) AS cut_count,
        EXISTS (
          SELECT 1 FROM bank_balances bb
          JOIN LATERAL (
            SELECT p.final_balance FROM bank_balances p
            WHERE p.bank_id = bb.bank_id AND p.operation_date < days.d
            ORDER BY p.operation_date DESC LIMIT 1
          ) prev ON true
          WHERE bb.operation_date = days.d AND bb.previous_balance <> prev.final_balance
        ) AS opening_mismatch,
        s.id AS active_session_id, su.username AS active_session_username,
        (SELECT count(*) FROM financial_day_review_sessions x WHERE x.review_date = days.d) AS review_count
      FROM days
      LEFT JOIN day_openings o ON o.date = days.d
      LEFT JOIN cash_operational_days cd ON cd.operational_date = days.d
      LEFT JOIN LATERAL (
        SELECT * FROM agent_reconciliations a WHERE a.date = days.d ORDER BY a.created_at DESC LIMIT 1
      ) r ON true
      LEFT JOIN financial_day_review_sessions s ON s.review_date = days.d AND s.status <> 'CLOSED'
      LEFT JOIN users su ON su.id = s.opened_by
      ORDER BY days.d DESC
      `,
      [from, to],
    );
    return rows.map((row) => ({
      date: str(row.day),
      agentDayStatus: strOrNull(
        row.agent_status,
      ) as FinancialDayListRow['agentDayStatus'],
      cashDayStatus: strOrNull(
        row.cash_status,
      ) as FinancialDayListRow['cashDayStatus'],
      cashOpening: numOrNull(row.opening_physical_cash),
      cashClosing:
        numOrNull(row.closing_physical_cash) ?? numOrNull(row.total_cash),
      totalBanks: numOrNull(row.total_banks),
      totalAccountsReceivable: numOrNull(row.total_accounts_receivable),
      totalAssets: numOrNull(row.total_assets),
      reconciliationResult: numOrNull(row.result),
      movementCount: num(row.movement_count),
      cutCount: num(row.cut_count),
      hasDifferences:
        num(row.result) !== 0 ||
        num(row.closing_difference) !== 0 ||
        row.opening_mismatch === true,
      activeSessionId: strOrNull(row.active_session_id),
      activeSessionUsername: strOrNull(row.active_session_username),
      reviewCount: num(row.review_count),
    }));
  }

  getDayData(day: string): Promise<FinancialDayRawData> {
    return this.loadDay(day, this.dataSource.manager);
  }

  async openSession(
    day: string,
    userId: string,
    reason: string,
    photograph: (data: FinancialDayRawData) => PhotographSummary,
  ): Promise<string> {
    return this.run(() =>
      this.dataSource.transaction(async (manager) => {
        const [{ id }]: Array<{ id: string }> = await manager.query(
          'SELECT open_financial_day_review($1, $2, $3) AS id',
          [day, userId, reason],
        );
        const summary = photograph(await this.loadDay(day, manager));
        await manager.query(
          `UPDATE financial_day_review_sessions
           SET snapshot_before = $2, difference_before = $3
           WHERE id = $1`,
          [id, JSON.stringify(summary.snapshot), summary.totalDifference],
        );
        return id;
      }),
    );
  }

  async correctSnapshot(data: CorrectSnapshotData): Promise<string> {
    return this.run(async () => {
      const [{ id }]: Array<{ id: string }> = await this.dataSource.query(
        'SELECT correct_financial_day_snapshot($1, $2, $3, $4, $5, $6, $7, $8, $9) AS id',
        [
          data.sessionId,
          data.target,
          data.targetId,
          data.field,
          data.newValue,
          data.reason,
          data.observations ?? null,
          data.userId,
          data.requestId,
        ],
      );
      return id;
    });
  }

  async adjustMovement(data: AdjustMovementData): Promise<string> {
    return this.run(async () => {
      const [{ id }]: Array<{ id: string }> = await this.dataSource.query(
        'SELECT adjust_financial_day_movement($1, $2, $3, $4, $5, $6, $7, $8) AS id',
        [
          data.sessionId,
          data.source,
          data.sourceId,
          data.correctedAmount,
          data.reason,
          data.observations ?? null,
          data.userId,
          data.requestId,
        ],
      );
      return id;
    });
  }

  async requestClose(sessionId: string, userId: string): Promise<void> {
    await this.run(() =>
      this.dataSource.query(
        'SELECT request_financial_day_review_close($1, $2)',
        [sessionId, userId],
      ),
    );
  }

  async closeSession(
    data: CloseSessionData,
    photograph: (data: FinancialDayRawData) => PhotographSummary,
  ): Promise<void> {
    await this.run(() =>
      this.dataSource.transaction(async (manager) => {
        const locked: SqlRow[] = await manager.query(
          `SELECT to_char(review_date, 'YYYY-MM-DD') AS day FROM financial_day_review_sessions
           WHERE id = $1 FOR UPDATE`,
          [data.sessionId],
        );
        if (locked.length === 0) {
          throw financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND');
        }
        const summary = photograph(
          await this.loadDay(str(locked[0].day), manager),
        );
        await manager.query(
          'SELECT close_financial_day_review($1, $2, $3, $4, $5, $6, $7)',
          [
            data.sessionId,
            data.userId,
            data.observations ?? null,
            summary.hasPendingDifferences,
            data.acceptPendingDifferences,
            summary.totalDifference,
            JSON.stringify(summary.snapshot),
          ],
        );
      }),
    );
  }

  async findSessionById(id: string): Promise<ReviewSessionRow | null> {
    const rows: SqlRow[] = await this.dataSource.query(
      `${SESSION_SELECT} WHERE s.id = $1`,
      [id],
    );
    return rows.length ? this.toSession(rows[0]) : null;
  }

  async findActiveSession(day: string): Promise<ReviewSessionRow | null> {
    const rows: SqlRow[] = await this.dataSource.query(
      `${SESSION_SELECT} WHERE s.review_date = $1 AND s.status <> 'CLOSED'`,
      [day],
    );
    return rows.length ? this.toSession(rows[0]) : null;
  }

  async listSessions(day: string): Promise<ReviewSessionRow[]> {
    const rows: SqlRow[] = await this.dataSource.query(
      `${SESSION_SELECT} WHERE s.review_date = $1 ORDER BY s.opened_at DESC`,
      [day],
    );
    return rows.map((row) => this.toSession(row));
  }

  async listCorrections(filter: {
    date?: string;
    sessionId?: string;
  }): Promise<CorrectionRow[]> {
    const rows: SqlRow[] = await this.dataSource.query(
      `
      SELECT c.*, to_char(c.review_date, 'YYYY-MM-DD') AS review_date_text, u.username
      FROM financial_day_corrections c JOIN users u ON u.id = c.created_by
      WHERE ($1::date IS NULL OR c.review_date = $1::date)
        AND ($2::uuid IS NULL OR c.session_id = $2::uuid)
      ORDER BY c.created_at DESC
      LIMIT 1000
      `,
      [filter.date ?? null, filter.sessionId ?? null],
    );
    return rows.map((row) => ({
      id: str(row.id),
      sessionId: str(row.session_id),
      reviewDate: str(row.review_date_text),
      module: str(row.module) as ReviewModule,
      correctionType: str(
        row.correction_type,
      ) as CorrectionRow['correctionType'],
      targetTable: str(row.target_table),
      targetId: str(row.target_id),
      field: str(row.field),
      originalValue: num(row.original_value),
      newValue: num(row.new_value),
      difference: num(row.difference),
      reason: str(row.reason),
      observations: strOrNull(row.observations),
      originalReference: strOrNull(row.original_reference),
      createdByUsername: str(row.username),
      createdAt: date(row.created_at),
    }));
  }

  // ── Day loader ──────────────────────────────────────────────────────────

  private async loadDay(
    day: string,
    manager: EntityManager,
  ): Promise<FinancialDayRawData> {
    // Sequential on purpose: inside a transaction all queries share one connection.
    const reconciliation = await this.loadReconciliation(day, manager);
    const agentDay = await this.loadAgentDay(day, manager);
    const banks = await this.loadBanks(day, manager);
    const bankMovements = await this.loadBankMovements(day, manager);
    const transactions = await this.loadTransactions(day, manager);
    const cashDay = await this.loadCashDay(day, manager);
    const cashMovements = await this.loadCashMovements(day, manager);
    const receivables = await this.loadPortfolio(
      'accounts_receivable',
      day,
      reconciliation,
      manager,
    );
    const assets = await this.loadPortfolio(
      'assets',
      day,
      reconciliation,
      manager,
    );
    const adjustments = await this.loadAdjustments(day, manager);
    const adjacentMovements = await this.loadAdjacent(day, manager);
    const cuts = cashDay ? await this.loadCuts(cashDay.id, manager) : [];
    return {
      date: day,
      agentDay,
      banks,
      bankMovements,
      transactions,
      cashDay,
      cuts,
      cashMovements,
      receivables,
      assets,
      reconciliation,
      adjustments,
      adjacentMovements,
    };
  }

  private async loadAgentDay(
    day: string,
    manager: EntityManager,
  ): Promise<AgentDayRaw | null> {
    const rows: SqlRow[] = await manager.query(
      `SELECT o.*, ou.username AS opened_by_username, cu.username AS closed_by_username
       FROM day_openings o JOIN users ou ON ou.id = o.opened_by
       LEFT JOIN users cu ON cu.id = o.closed_by
       WHERE o.date = $1`,
      [day],
    );
    if (!rows.length) {
      return null;
    }
    const row = rows[0];
    return {
      status: row.is_cancelled
        ? 'CANCELADO'
        : row.closed_at
          ? 'CERRADO'
          : 'ABIERTO',
      openedAt: date(row.opened_at),
      openedByUsername: str(row.opened_by_username),
      closedAt: dateOrNull(row.closed_at),
      closedByUsername: strOrNull(row.closed_by_username),
      reopenedAt: dateOrNull(row.reopened_at),
      reopenReason: strOrNull(row.reopen_reason),
    };
  }

  private async loadBanks(
    day: string,
    manager: EntityManager,
  ): Promise<DayBankRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `
      SELECT b.id, b.name, b.account_number, b.special_account, at.name AS type_name, b.is_active,
             bb.id AS bb_id, bb.previous_balance, bb.final_balance,
             to_char(prev.operation_date, 'YYYY-MM-DD') AS prev_date, prev.final_balance AS prev_final,
             to_char(nxt.operation_date, 'YYYY-MM-DD') AS next_date, nxt.previous_balance AS next_previous,
             (SELECT m.balance_after FROM bank_account_movements m
              WHERE m.bank_id = b.id AND m.business_date < $1 ORDER BY m.sequence DESC LIMIT 1) AS ledger_opening,
             (SELECT to_char(min(m.business_date), 'YYYY-MM-DD') FROM bank_account_movements m
              WHERE m.bank_id = b.id) AS first_ledger_date
      FROM banks b
      JOIN account_types at ON at.id = b.account_type_id
      LEFT JOIN bank_balances bb ON bb.bank_id = b.id AND bb.operation_date = $1
      LEFT JOIN LATERAL (
        SELECT operation_date, final_balance FROM bank_balances
        WHERE bank_id = b.id AND operation_date < $1 ORDER BY operation_date DESC LIMIT 1
      ) prev ON true
      LEFT JOIN LATERAL (
        SELECT operation_date, previous_balance FROM bank_balances
        WHERE bank_id = b.id AND operation_date > $1 ORDER BY operation_date LIMIT 1
      ) nxt ON true
      WHERE b.is_active OR bb.id IS NOT NULL
         OR EXISTS (SELECT 1 FROM bank_account_movements m WHERE m.bank_id = b.id AND m.business_date = $1)
      ORDER BY b.name
      `,
      [day],
    );
    return rows.map((row) => ({
      bankId: str(row.id),
      name: str(row.name),
      accountNumber: strOrNull(row.account_number),
      specialAccount: strOrNull(row.special_account),
      accountTypeName: str(row.type_name),
      isActive: row.is_active === true,
      balanceRowId: strOrNull(row.bb_id),
      previousBalance: numOrNull(row.previous_balance),
      finalBalance: numOrNull(row.final_balance),
      previousDayDate: strOrNull(row.prev_date),
      previousDayFinal: numOrNull(row.prev_final),
      nextDayDate: strOrNull(row.next_date),
      nextDayPrevious: numOrNull(row.next_previous),
      ledgerOpening: numOrNull(row.ledger_opening),
      firstLedgerDate: strOrNull(row.first_ledger_date),
    }));
  }

  private async loadBankMovements(
    day: string,
    manager: EntityManager,
  ): Promise<DayBankMovementRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `SELECT m.*, b.name AS bank_name, u.username
       FROM bank_account_movements m
       JOIN banks b ON b.id = m.bank_id
       JOIN users u ON u.id = m.user_id
       WHERE m.business_date = $1
       ORDER BY m.sequence`,
      [day],
    );
    return rows.map((row) => ({
      id: str(row.id),
      sequence: num(row.sequence),
      bankId: str(row.bank_id),
      bankName: str(row.bank_name),
      movementType: str(row.movement_type),
      origin: str(row.origin),
      amount: num(row.amount),
      balanceBefore: num(row.balance_before),
      balanceAfter: num(row.balance_after),
      status: str(row.status),
      referenceType: strOrNull(row.reference_type),
      referenceId: strOrNull(row.reference_id),
      referenceText: strOrNull(row.reference_text),
      concept: strOrNull(row.concept),
      createdAt: date(row.created_at),
      username: str(row.username),
    }));
  }

  private async loadTransactions(
    day: string,
    manager: EntityManager,
  ): Promise<DayTransactionRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `SELECT o.id, o.total_amount, o.transaction_count, o.is_voided, o.created_at, o.client_name, o.description,
              o.bank_account_id, tt.name AS type_name, tt.balance_effect, tt.cash_effect,
              tb.name AS agent_bank_name, ba.name AS bank_account_name, u.username
       FROM bank_deposit_operations o
       LEFT JOIN transaction_types tt ON tt.id = o.transaction_type_id
       LEFT JOIN transaction_banks tb ON tb.id = o.transaction_bank_id
       LEFT JOIN banks ba ON ba.id = o.bank_account_id
       JOIN users u ON u.id = o.user_id
       WHERE o.operation_date = $1
       ORDER BY o.created_at`,
      [day],
    );
    return rows.map((row) => ({
      id: str(row.id),
      typeName: strOrNull(row.type_name),
      balanceEffect: strOrNull(row.balance_effect),
      cashEffect: strOrNull(row.cash_effect),
      totalAmount: num(row.total_amount),
      transactionCount: num(row.transaction_count),
      agentBankName: strOrNull(row.agent_bank_name),
      bankAccountId: strOrNull(row.bank_account_id),
      bankAccountName: strOrNull(row.bank_account_name),
      clientName: strOrNull(row.client_name),
      description: strOrNull(row.description),
      isVoided: row.is_voided === true,
      createdAt: date(row.created_at),
      username: str(row.username),
    }));
  }

  private async loadCashDay(
    day: string,
    manager: EntityManager,
  ): Promise<CashDayRaw | null> {
    const rows: SqlRow[] = await manager.query(
      `SELECT d.*,
              to_char(prev.operational_date, 'YYYY-MM-DD') AS prev_date, prev.closing_physical_cash AS prev_closing,
              to_char(nxt.operational_date, 'YYYY-MM-DD') AS next_date, nxt.opening_physical_cash AS next_opening
       FROM cash_operational_days d
       LEFT JOIN LATERAL (
         SELECT operational_date, closing_physical_cash FROM cash_operational_days
         WHERE operational_date < d.operational_date ORDER BY operational_date DESC LIMIT 1
       ) prev ON true
       LEFT JOIN LATERAL (
         SELECT operational_date, opening_physical_cash FROM cash_operational_days
         WHERE operational_date > d.operational_date ORDER BY operational_date LIMIT 1
       ) nxt ON true
       WHERE d.operational_date = $1`,
      [day],
    );
    if (!rows.length) {
      return null;
    }
    const row = rows[0];
    return {
      id: str(row.id),
      status: str(row.status) as CashDayRaw['status'],
      openingPolicy: str(row.opening_policy),
      openingSystemCash: num(row.opening_system_cash),
      openingPhysicalCash: num(row.opening_physical_cash),
      previousClosingPhysicalCash: numOrNull(
        row.previous_closing_physical_cash,
      ),
      previousClosingSystemCash: numOrNull(row.previous_closing_system_cash),
      inheritedDifference: num(row.inherited_difference),
      openingSequence: num(row.opening_sequence),
      closingSequence: numOrNull(row.closing_sequence),
      closingSystemCash: numOrNull(row.closing_system_cash),
      closingPhysicalCash: numOrNull(row.closing_physical_cash),
      closingDifference: numOrNull(row.closing_difference),
      totalIn: numOrNull(row.total_in),
      totalOut: numOrNull(row.total_out),
      movementCount: numOrNull(row.movement_count),
      openedAt: date(row.opened_at),
      closedAt: dateOrNull(row.closed_at),
      previousDayDate: strOrNull(row.prev_date),
      previousDayClosingPhysical: numOrNull(row.prev_closing),
      nextDayDate: strOrNull(row.next_date),
      nextDayOpeningPhysical: numOrNull(row.next_opening),
    };
  }

  private async loadCuts(
    dayId: string,
    manager: EntityManager,
  ): Promise<CashCutRaw[]> {
    const cuts: SqlRow[] = await manager.query(
      `SELECT p.*,
              COALESCE(r.range_in, 0) AS range_in, COALESCE(r.range_out, 0) AS range_out,
              COALESCE(r.range_count, 0) AS range_count
       FROM cash_cut_periods p
       LEFT JOIN LATERAL (
         SELECT sum(CASE WHEN m.direction = 'IN' THEN m.amount ELSE 0 END) AS range_in,
                sum(CASE WHEN m.direction = 'OUT' THEN m.amount ELSE 0 END) AS range_out,
                count(*) AS range_count
         FROM cash_movements m
         WHERE p.start_sequence IS NOT NULL AND p.closing_sequence IS NOT NULL
           AND m.sequence > p.start_sequence AND m.sequence <= p.closing_sequence
       ) r ON true
       WHERE p.operational_day_id = $1
       ORDER BY p.period_number`,
      [dayId],
    );
    const ids = cuts.map((cut) => str(cut.id));
    const counts: SqlRow[] = ids.length
      ? await manager.query(
          `SELECT c.*, u.username FROM cash_cut_counts c JOIN users u ON u.id = c.created_by
           WHERE c.cut_period_id = ANY($1::uuid[]) ORDER BY c.created_at`,
          [ids],
        )
      : [];
    const recs: SqlRow[] = ids.length
      ? await manager.query(
          `SELECT * FROM cash_cut_bank_reconciliations
           WHERE cut_period_id = ANY($1::uuid[]) ORDER BY bank_name`,
          [ids],
        )
      : [];
    return cuts.map((cut) => ({
      id: str(cut.id),
      periodNumber: num(cut.period_number),
      status: str(cut.status),
      scheduledStartAt: date(cut.scheduled_start_at),
      scheduledEndAt: date(cut.scheduled_end_at),
      actualStartedAt: dateOrNull(cut.actual_started_at),
      actualFinishedAt: dateOrNull(cut.actual_finished_at),
      startSequence: numOrNull(cut.start_sequence),
      closingSequence: numOrNull(cut.closing_sequence),
      openingSystemCash: numOrNull(cut.opening_system_cash),
      openingPhysicalCash: numOrNull(cut.opening_physical_cash),
      closingSystemCash: numOrNull(cut.closing_system_cash),
      closingPhysicalCash: numOrNull(cut.closing_physical_cash),
      cashDifference: numOrNull(cut.cash_difference),
      totalIn: numOrNull(cut.total_in),
      totalOut: numOrNull(cut.total_out),
      movementCount: numOrNull(cut.movement_count),
      reopenedCount: num(cut.reopened_count),
      rangeIn: num(cut.range_in),
      rangeOut: num(cut.range_out),
      rangeCount: num(cut.range_count),
      counts: counts
        .filter((count) => str(count.cut_period_id) === str(cut.id))
        .map((count) => ({
          id: str(count.id),
          totalCounted: num(count.total_counted),
          systemCash: num(count.system_cash),
          difference: num(count.difference),
          isCurrent: count.is_current === true,
          createdAt: date(count.created_at),
          username: str(count.username),
        })),
      bankReconciliations: recs
        .filter((rec) => str(rec.cut_period_id) === str(cut.id))
        .map((rec) => ({
          id: str(rec.id),
          bankId: str(rec.bank_id),
          bankName: str(rec.bank_name),
          systemBalance: num(rec.system_balance),
          verifiedBalance: num(rec.verified_balance),
          difference: num(rec.difference),
          countId: str(rec.count_id),
        })),
    }));
  }

  private async loadCashMovements(
    day: string,
    manager: EntityManager,
  ): Promise<DayCashMovementRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `SELECT m.*, u.username FROM cash_movements m JOIN users u ON u.id = m.created_by
       WHERE m.operational_date = $1 ORDER BY m.sequence`,
      [day],
    );
    return rows.map((row) => ({
      id: str(row.id),
      sequence: num(row.sequence),
      movementType: str(row.movement_type),
      direction: str(row.direction) as DayCashMovementRaw['direction'],
      amount: num(row.amount),
      previousBalance: num(row.previous_balance),
      newBalance: num(row.new_balance),
      status: str(row.status),
      referenceType: strOrNull(row.reference_type),
      referenceId: strOrNull(row.reference_id),
      description: str(row.description),
      bankName: strOrNull(row.bank_name),
      cutPeriodId: strOrNull(row.cut_period_id),
      createdAt: date(row.created_at),
      username: str(row.username),
    }));
  }

  private toPortfolioRow(row: SqlRow): PortfolioRowRaw {
    return {
      id: str(row.id),
      sequence: num(row.sequence),
      clientId: str(row.client_id),
      clientName: str(row.client_name),
      date: str(row.date_text),
      amount: num(row.amount),
      movementType: str(row.movement_type) as PortfolioRowRaw['movementType'],
      description: strOrNull(row.description),
      referenceType: strOrNull(row.reference_type),
      isActive: row.is_active === true,
      createdAt: date(row.created_at),
      updatedAt: date(row.updated_at),
      username: str(row.username),
    };
  }

  private async loadPortfolio(
    table: PortfolioTable,
    day: string,
    reconciliation: ReconciliationRaw | null,
    manager: EntityManager,
  ): Promise<PortfolioRaw> {
    const clientRows: SqlRow[] = await manager.query(
      `
      SELECT t.client_id, c.name AS client_name,
        sum(CASE WHEN t.date < $1 THEN (CASE WHEN t.movement_type = 'ABONO' THEN -t.amount ELSE t.amount END) ELSE 0 END) AS opening,
        sum(CASE WHEN t.date = $1 AND t.movement_type = 'CARGO' THEN t.amount ELSE 0 END) AS charges,
        sum(CASE WHEN t.date = $1 AND t.movement_type = 'ABONO' AND t.reference_type IS DISTINCT FROM 'AR_PAYMENT'
                 THEN t.amount ELSE 0 END) AS payments,
        sum(CASE WHEN t.date = $1 AND t.movement_type = 'ABONO' AND t.reference_type = 'AR_PAYMENT'
                 THEN t.amount ELSE 0 END) AS settlements
      FROM ${table} t JOIN clients c ON c.id = t.client_id
      WHERE t.is_active AND t.date <= $1
      GROUP BY t.client_id, c.name
      HAVING sum(CASE WHEN t.movement_type = 'ABONO' THEN -t.amount ELSE t.amount END) <> 0
          OR bool_or(t.date = $1)
      ORDER BY c.name
      `,
      [day],
    );
    const rows: SqlRow[] = await manager.query(
      `SELECT ${PORTFOLIO_ROW_COLUMNS}
       FROM ${table} t JOIN clients c ON c.id = t.client_id JOIN users u ON u.id = t.created_by
       WHERE t.date = $1 ORDER BY t.sequence`,
      [day],
    );
    let lateRows: PortfolioLateRowRaw[] = [];
    if (reconciliation) {
      const late: SqlRow[] = await manager.query(
        `
        SELECT ${PORTFOLIO_ROW_COLUMNS},
          CASE
            WHEN t.is_active AND t.date <= $1 AND t.created_at > $2 THEN 'CREATED_AFTER_CLOSE'
            WHEN NOT t.is_active AND t.date <= $1 AND t.created_at <= $2 AND t.updated_at > $2 THEN 'DEACTIVATED_AFTER_CLOSE'
            ELSE 'LATER_DATE_BEFORE_CLOSE'
          END AS kind
        FROM ${table} t JOIN clients c ON c.id = t.client_id JOIN users u ON u.id = t.created_by
        WHERE (t.is_active AND t.date <= $1 AND t.created_at > $2)
           OR (NOT t.is_active AND t.date <= $1 AND t.created_at <= $2 AND t.updated_at > $2)
           OR (t.is_active AND t.date > $1 AND t.created_at <= $2)
        ORDER BY t.sequence
        LIMIT 300
        `,
        [day, reconciliation.createdAt],
      );
      lateRows = late.map((row) => ({
        ...this.toPortfolioRow(row),
        kind: str(row.kind) as PortfolioLateRowRaw['kind'],
      }));
    }
    return {
      clients: clientRows.map((row): PortfolioClientRaw => ({
        clientId: str(row.client_id),
        clientName: str(row.client_name),
        opening: num(row.opening),
        charges: num(row.charges),
        payments: num(row.payments),
        settlements: num(row.settlements),
      })),
      rows: rows.map((row) => this.toPortfolioRow(row)),
      lateRows,
    };
  }

  private async loadReconciliation(
    day: string,
    manager: EntityManager,
  ): Promise<ReconciliationRaw | null> {
    const rows: SqlRow[] = await manager.query(
      `SELECT a.*, u.username, count(*) OVER () AS rows_for_date
       FROM agent_reconciliations a JOIN users u ON u.id = a.created_by
       WHERE a.date = $1 ORDER BY a.created_at DESC`,
      [day],
    );
    if (!rows.length) {
      return null;
    }
    const row = rows[0];
    return {
      id: str(row.id),
      totalCash: num(row.total_cash),
      totalWarehouseCash: num(row.total_warehouse_cash),
      totalBanks: num(row.total_banks),
      totalAssets: num(row.total_assets),
      totalAccountsReceivable: num(row.total_accounts_receivable),
      result: num(row.result),
      createdAt: date(row.created_at),
      username: str(row.username),
      rowsForDate: num(row.rows_for_date),
    };
  }

  private async loadAdjustments(
    day: string,
    manager: EntityManager,
  ): Promise<AdjustmentRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `SELECT a.*, COALESCE(json_agg(json_build_object(
                'scope', e.scope, 'bankId', e.bank_id, 'clientId', e.client_id, 'amount', e.amount
              )) FILTER (WHERE e.id IS NOT NULL), '[]') AS effects
       FROM financial_day_adjustments a
       LEFT JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id
       WHERE a.review_date = $1 AND a.status = 'VIGENTE'
       GROUP BY a.id
       ORDER BY a.created_at`,
      [day],
    );
    return rows.map((row) => ({
      id: str(row.id),
      correctionId: str(row.correction_id),
      module: str(row.module) as ReviewModule,
      sourceTable: str(row.source_table),
      sourceId: str(row.source_id),
      originalAmount: num(row.original_amount),
      correctedAmount: num(row.corrected_amount),
      delta: num(row.delta),
      effects: (row.effects as SqlRow[]).map((effect) => ({
        scope: str(effect.scope) as AdjustmentRaw['effects'][number]['scope'],
        bankId: strOrNull(effect.bankId),
        clientId: strOrNull(effect.clientId),
        amount: num(effect.amount),
      })),
    }));
  }

  private async loadAdjacent(
    day: string,
    manager: EntityManager,
  ): Promise<AdjacentMovementRaw[]> {
    const rows: SqlRow[] = await manager.query(
      `
      SELECT * FROM (
        SELECT 'BANK_MOVEMENT' AS source, m.id, to_char(m.business_date, 'YYYY-MM-DD') AS day,
               m.movement_type || ' — ' || b.name AS label, m.amount, m.bank_id
        FROM bank_account_movements m JOIN banks b ON b.id = m.bank_id
        WHERE m.business_date IN ($1::date - 1, $1::date + 1) AND m.status = 'APLICADO'
        UNION ALL
        SELECT 'CASH_MOVEMENT', m.id, to_char(m.operational_date, 'YYYY-MM-DD'),
               m.movement_type || ' — ' || m.description,
               CASE m.direction WHEN 'IN' THEN m.amount WHEN 'OUT' THEN -m.amount ELSE 0 END, NULL
        FROM cash_movements m
        WHERE m.operational_date IN ($1::date - 1, $1::date + 1) AND m.status = 'VIGENTE'
        UNION ALL
        SELECT 'ACCOUNT_RECEIVABLE', t.id, to_char(t.date, 'YYYY-MM-DD'),
               t.movement_type || ' CxC — ' || c.name,
               CASE WHEN t.movement_type = 'ABONO' THEN -t.amount ELSE t.amount END, NULL
        FROM accounts_receivable t JOIN clients c ON c.id = t.client_id
        WHERE t.date IN ($1::date - 1, $1::date + 1) AND t.is_active
        UNION ALL
        SELECT 'ASSET', t.id, to_char(t.date, 'YYYY-MM-DD'),
               t.movement_type || ' Activo — ' || c.name,
               CASE WHEN t.movement_type = 'ABONO' THEN -t.amount ELSE t.amount END, NULL
        FROM assets t JOIN clients c ON c.id = t.client_id
        WHERE t.date IN ($1::date - 1, $1::date + 1) AND t.is_active
      ) x LIMIT 1000
      `,
      [day],
    );
    return rows.map((row) => ({
      source: str(row.source) as AdjacentMovementRaw['source'],
      id: str(row.id),
      date: str(row.day),
      label: str(row.label),
      amount: num(row.amount),
      bankId: strOrNull(row.bank_id),
    }));
  }

  private toSession(row: SqlRow): ReviewSessionRow {
    return {
      id: str(row.id),
      reviewDate: str(row.review_date_text),
      status: str(row.status) as ReviewSessionStatus,
      reason: str(row.reason),
      openedById: str(row.opened_by),
      openedByUsername: str(row.opened_by_username),
      openedAt: date(row.opened_at),
      closeRequestedAt: dateOrNull(row.close_requested_at),
      closedByUsername: strOrNull(row.closed_by_username),
      closedAt: dateOrNull(row.closed_at),
      closeObservations: strOrNull(row.close_observations),
      correctionsCount: num(row.corrections_count),
      hasPendingDifferences:
        row.has_pending_differences === null ||
        row.has_pending_differences === undefined
          ? null
          : row.has_pending_differences === true,
      differenceBefore: numOrNull(row.difference_before),
      differenceAfter: numOrNull(row.difference_after),
      snapshotBefore: row.snapshot_before ?? null,
      snapshotAfter: row.snapshot_after ?? null,
    };
  }

  /** Runs a write and maps `RAISE EXCEPTION '<CODE>'` to the domain error. */
  private async run<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const mapped = financialDayReviewErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
        // A day row guarded by the review trigger can also surface through other modules.
      }
      throw error;
    }
  }
}
