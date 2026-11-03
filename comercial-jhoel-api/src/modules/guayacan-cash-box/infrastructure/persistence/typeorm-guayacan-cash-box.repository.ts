import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  FindGuayacanCashCountsOptions,
  FindGuayacanCashMovementsOptions,
  GuayacanCashBoxRepository,
  GuayacanCashBoxSummary,
  GuayacanCashCountRow,
  GuayacanCashDenominationRow,
  GuayacanCashMovementDetail,
  GuayacanCashMovementRow,
  GuayacanCashMovementType,
  GuayacanPeriodSummary,
  PaginatedGuayacanCashCounts,
  PaginatedGuayacanCashMovements,
  PaginatedGuayacanCommissions,
  RegisterGuayacanCashCountData,
  RegisterGuayacanCashMovementData,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { guayacanCashBoxErrorFromMessage } from '../../domain/errors/guayacan-cash-box.errors';

interface MovementSqlRow {
  id: string;
  sequence: string;
  movement_type: GuayacanCashMovementType;
  amount: string;
  balance_before: string;
  balance_after: string;
  business_date: string;
  concept: string;
  reason: string | null;
  notes: string | null;
  reference_type: string | null;
  reference_id: string | null;
  transaction_count: number | null;
  commission_rate: string | null;
  reversal_of_id: string | null;
  status: 'VIGENTE' | 'ANULADO';
  voided_at: Date | null;
  voided_by_username: string | null;
  void_reason: string | null;
  created_by: string;
  created_by_username: string | null;
  created_at: Date;
}

const MOVEMENT_COLUMNS = `
  m.id, m.sequence, m.movement_type, m.amount, m.balance_before, m.balance_after,
  to_char(m.business_date, 'YYYY-MM-DD') AS business_date, m.concept, m.reason, m.notes,
  m.reference_type, m.reference_id, m.transaction_count, m.commission_rate, m.reversal_of_id,
  m.status, m.voided_at, vu.username AS voided_by_username, m.void_reason,
  m.created_by, cu.username AS created_by_username, m.created_at
`;
const MOVEMENT_FROM = `
  FROM guayacan_cash_movements m
  JOIN users cu ON cu.id = m.created_by
  LEFT JOIN users vu ON vu.id = m.voided_by
`;

interface CountSqlRow {
  id: string;
  sequence: string;
  business_date: string;
  total_counted: string;
  system_balance: string;
  difference: string;
  notes: string | null;
  last_movement_id: string | null;
  last_movement_sequence: string | null;
  created_by: string;
  created_by_username: string | null;
  created_at: Date;
}

const COUNT_COLUMNS = `
  c.id, c.sequence, to_char(c.business_date, 'YYYY-MM-DD') AS business_date,
  c.total_counted, c.system_balance, c.difference, c.notes,
  c.last_movement_id, lm.sequence AS last_movement_sequence,
  c.created_by, u.username AS created_by_username, c.created_at
`;
const COUNT_FROM = `
  FROM guayacan_cash_counts c
  JOIN users u ON u.id = c.created_by
  LEFT JOIN guayacan_cash_movements lm ON lm.id = c.last_movement_id
`;

/** Número visible del arqueo: correlativo con ceros ("ARQ-0007"). */
export function formatCountNumber(sequence: number): string {
  return `ARQ-${String(sequence).padStart(4, '0')}`;
}

function toCount(row: CountSqlRow): Omit<GuayacanCashCountRow, 'details'> {
  const sequence = Number(row.sequence);
  const difference = toNumber(row.difference);
  return {
    id: row.id,
    sequence,
    number: formatCountNumber(sequence),
    status:
      difference === 0 ? 'CUADRADO' : difference > 0 ? 'SOBRANTE' : 'FALTANTE',
    lastMovementId: row.last_movement_id,
    lastMovementSequence:
      row.last_movement_sequence === null
        ? null
        : Number(row.last_movement_sequence),
    businessDate: row.business_date,
    totalCounted: toNumber(row.total_counted),
    systemBalance: toNumber(row.system_balance),
    difference,
    notes: row.notes,
    createdBy: row.created_by,
    createdByUsername: row.created_by_username ?? '',
    createdAt: row.created_at,
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toNumber(value: string | number | null): number {
  return value === null ? 0 : Number(value);
}

function toMovement(row: MovementSqlRow): GuayacanCashMovementRow {
  return {
    id: row.id,
    sequence: Number(row.sequence),
    movementType: row.movement_type,
    amount: toNumber(row.amount),
    balanceBefore: toNumber(row.balance_before),
    balanceAfter: toNumber(row.balance_after),
    businessDate: row.business_date,
    concept: row.concept,
    reason: row.reason,
    notes: row.notes,
    referenceType: row.reference_type,
    referenceId: row.reference_id,
    transactionCount: row.transaction_count,
    commissionRate:
      row.commission_rate === null ? null : toNumber(row.commission_rate),
    reversalOfId: row.reversal_of_id,
    status: row.status,
    voidedAt: row.voided_at,
    voidedByUsername: row.voided_by_username,
    voidReason: row.void_reason,
    createdBy: row.created_by,
    createdByUsername: row.created_by_username ?? '',
    createdAt: row.created_at,
  };
}

function toDenominations(
  rows: { denomination: string; quantity: number; subtotal: string }[],
): GuayacanCashDenominationRow[] {
  return rows.map((row) => ({
    denomination: toNumber(row.denomination),
    quantity: Number(row.quantity),
    subtotal: toNumber(row.subtotal),
  }));
}

/**
 * Caja Guayacán sobre SQL crudo: TODA escritura del Kardex pasa por las
 * funciones de la migración `CreateGuayacanCashBox` (lock global de la caja,
 * saldo leído bajo lock) — este repositorio nunca inserta movimientos ni
 * calcula saldos por su cuenta. Los períodos (día, semana lunes–domingo,
 * mes) los calcula PostgreSQL en `America/Guatemala`.
 */
@Injectable()
export class TypeOrmGuayacanCashBoxRepository implements GuayacanCashBoxRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async registerMovement(
    data: RegisterGuayacanCashMovementData,
  ): Promise<string> {
    try {
      const rows = await this.dataSource.query<{ id: string }[]>(
        'SELECT register_guayacan_cash_movement($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9) AS id',
        [
          data.movementType,
          data.amount,
          data.businessDate,
          data.userId,
          data.concept,
          data.reason,
          data.notes,
          JSON.stringify(data.cashDetails),
          data.clientRequestId,
        ],
      );
      return rows[0].id;
    } catch (error) {
      throw this.translate(error);
    }
  }

  async voidMovement(
    movementId: string,
    businessDate: string,
    userId: string,
    reason: string,
  ): Promise<string> {
    try {
      const rows = await this.dataSource.query<{ id: string }[]>(
        'SELECT void_guayacan_cash_movement($1, $2, $3, $4) AS id',
        [movementId, businessDate, userId, reason],
      );
      return rows[0].id;
    } catch (error) {
      throw this.translate(error, movementId);
    }
  }

  async findMovementById(
    id: string,
  ): Promise<GuayacanCashMovementDetail | null> {
    const rows = await this.dataSource.query<MovementSqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM} WHERE m.id = $1`,
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    const movement = toMovement(rows[0]);

    const details = await this.dataSource.query<
      { denomination: string; quantity: number; subtotal: string }[]
    >(
      `SELECT denomination, quantity, subtotal FROM guayacan_cash_movement_details
       WHERE movement_id = $1 ORDER BY denomination DESC`,
      [id],
    );

    let operation: GuayacanCashMovementDetail['operation'] = null;
    if (movement.referenceType === 'BANK_DEPOSIT' && movement.referenceId) {
      const operations = await this.dataSource.query<
        {
          id: string;
          transaction_type_name: string;
          transaction_bank_name: string | null;
          total_amount: string;
          transaction_count: number;
          operation_date: string;
          is_voided: boolean;
          change_given: string;
        }[]
      >(
        `SELECT o.id, tt.name AS transaction_type_name, tb.name AS transaction_bank_name,
                o.total_amount, o.transaction_count,
                to_char(o.operation_date, 'YYYY-MM-DD') AS operation_date, o.is_voided, o.change_given
         FROM bank_deposit_operations o
         JOIN transaction_types tt ON tt.id = o.transaction_type_id
         LEFT JOIN transaction_banks tb ON tb.id = o.transaction_bank_id
         WHERE o.id = $1`,
        [movement.referenceId],
      );
      if (operations[0]) {
        const row = operations[0];
        // El desglose físico de la operación (si se registró con desglose).
        const operationCash = await this.dataSource.query<
          { denomination: string; quantity: number; subtotal: string }[]
        >(
          `SELECT denomination, quantity, subtotal FROM bank_deposit_cash_details
           WHERE operation_id = $1 AND quantity > 0 ORDER BY denomination DESC`,
          [row.id],
        );
        operation = {
          id: row.id,
          transactionTypeName: row.transaction_type_name,
          transactionBankName: row.transaction_bank_name,
          totalAmount: toNumber(row.total_amount),
          transactionCount: Number(row.transaction_count),
          operationDate: row.operation_date,
          isVoided: row.is_voided,
          changeGiven: toNumber(row.change_given),
          cashDetails: toDenominations(operationCash),
        };
      }
    }

    return { ...movement, cashDetails: toDenominations(details), operation };
  }

  async findMovements(
    options: FindGuayacanCashMovementsOptions,
  ): Promise<PaginatedGuayacanCashMovements> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (options.startDate) {
      params.push(options.startDate);
      conditions.push(`m.business_date >= $${params.length}`);
    }
    if (options.endDate) {
      params.push(options.endDate);
      conditions.push(`m.business_date <= $${params.length}`);
    }
    if (options.movementType) {
      params.push(options.movementType);
      conditions.push(`m.movement_type = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalRows = await this.dataSource.query<{ total: string }[]>(
      `SELECT count(*) AS total FROM guayacan_cash_movements m ${where}`,
      params,
    );

    const pageParams = [
      ...params,
      options.limit,
      (options.page - 1) * options.limit,
    ];
    const rows = await this.dataSource.query<MovementSqlRow[]>(
      `SELECT ${MOVEMENT_COLUMNS} ${MOVEMENT_FROM} ${where}
       ORDER BY m.sequence DESC
       LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`,
      pageParams,
    );

    return {
      items: rows.map(toMovement),
      total: Number(totalRows[0]?.total ?? 0),
      page: options.page,
      limit: options.limit,
    };
  }

  async getSummary(): Promise<GuayacanCashBoxSummary> {
    const [periods] = await this.dataSource.query<
      {
        today: string;
        week_start: string;
        week_end: string;
        month_start: string;
        month_end: string;
      }[]
    >(`
      WITH d AS (SELECT (now() AT TIME ZONE 'America/Guatemala')::date AS today)
      SELECT to_char(today, 'YYYY-MM-DD') AS today,
             to_char(date_trunc('week', today)::date, 'YYYY-MM-DD') AS week_start,
             to_char(date_trunc('week', today)::date + 6, 'YYYY-MM-DD') AS week_end,
             to_char(date_trunc('month', today)::date, 'YYYY-MM-DD') AS month_start,
             to_char((date_trunc('month', today) + interval '1 month - 1 day')::date, 'YYYY-MM-DD') AS month_end
      FROM d
    `);

    const agents = await this.dataSource.query<
      { id: string; name: string; commission_per_transaction: string | null }[]
    >(
      `SELECT id, name, commission_per_transaction FROM transaction_banks
       WHERE cash_box_code = 'GUAYACAN' LIMIT 1`,
    );
    const agent = agents[0]
      ? {
          id: agents[0].id,
          name: agents[0].name,
          commissionPerTransaction:
            agents[0].commission_per_transaction === null
              ? null
              : toNumber(agents[0].commission_per_transaction),
        }
      : null;

    const balanceRows = await this.dataSource.query<
      { balance: string | null }[]
    >(
      'SELECT balance_after AS balance FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1',
    );

    const [daily, weekly, monthly] = await Promise.all([
      this.periodSummary(periods.today, periods.today),
      this.periodSummary(periods.week_start, periods.week_end),
      this.periodSummary(periods.month_start, periods.month_end),
    ]);

    return {
      agent,
      balance: toNumber(balanceRows[0]?.balance ?? null),
      today: periods.today,
      daily,
      weekly,
      monthly,
    };
  }

  private async periodSummary(
    startDate: string,
    endDate: string,
  ): Promise<GuayacanPeriodSummary> {
    const [operations] = await this.dataSource.query<
      { transaction_count: string; operation_count: string }[]
    >(
      `SELECT COALESCE(SUM(o.transaction_count), 0) AS transaction_count, count(*) AS operation_count
       FROM bank_deposit_operations o
       JOIN transaction_banks t ON t.id = o.transaction_bank_id
       WHERE t.cash_box_code = 'GUAYACAN' AND o.is_voided = false
         AND o.operation_date BETWEEN $1 AND $2`,
      [startDate, endDate],
    );
    const [commissions] = await this.dataSource.query<
      { commission_total: string }[]
    >(
      `SELECT COALESCE(SUM(amount), 0) AS commission_total
       FROM guayacan_commissions
       WHERE status = 'VIGENTE' AND business_date BETWEEN $1 AND $2`,
      [startDate, endDate],
    );
    // Solo movimientos vigentes: un anulado y su contrapartida (ANULACION /
    // REVERSO_COMISION) se cancelan y no inflan ningún total.
    const [movements] = await this.dataSource.query<
      {
        manual_income: string;
        manual_expense: string;
        transaction_in: string;
        transaction_out: string;
        adjustment: string;
      }[]
    >(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE movement_type = 'INGRESO'), 0) AS manual_income,
         COALESCE(-SUM(amount) FILTER (WHERE movement_type = 'EGRESO'), 0) AS manual_expense,
         COALESCE(SUM(amount) FILTER (WHERE movement_type = 'TRANSACCION_DEPOSITO'), 0) AS transaction_in,
         COALESCE(-SUM(amount) FILTER (WHERE movement_type = 'TRANSACCION_RETIRO'), 0) AS transaction_out,
         COALESCE(SUM(amount) FILTER (WHERE movement_type = 'AJUSTE'), 0) AS adjustment
       FROM guayacan_cash_movements
       WHERE status = 'VIGENTE' AND business_date BETWEEN $1 AND $2`,
      [startDate, endDate],
    );
    return {
      startDate,
      endDate,
      transactionCount: Number(operations?.transaction_count ?? 0),
      operationCount: Number(operations?.operation_count ?? 0),
      commissionTotal: toNumber(commissions?.commission_total ?? null),
      manualIncomeTotal: toNumber(movements?.manual_income ?? null),
      manualExpenseTotal: toNumber(movements?.manual_expense ?? null),
      transactionInTotal: toNumber(movements?.transaction_in ?? null),
      transactionOutTotal: toNumber(movements?.transaction_out ?? null),
      adjustmentTotal: toNumber(movements?.adjustment ?? null),
    };
  }

  async registerCount(data: RegisterGuayacanCashCountData): Promise<string> {
    return this.dataSource.transaction(async (manager) => {
      // Mismo lock que los movimientos: el saldo comparado es el de ese instante.
      await manager.query(
        "SELECT pg_advisory_xact_lock(hashtext('guayacan_cash_box'))",
      );

      if (data.clientRequestId) {
        const existing = await manager.query<{ id: string }[]>(
          'SELECT id FROM guayacan_cash_counts WHERE client_request_id = $1',
          [data.clientRequestId],
        );
        if (existing[0]) {
          return existing[0].id;
        }
      }

      const balanceRows = await manager.query<
        { id: string; balance: string }[]
      >(
        'SELECT id, balance_after AS balance FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1',
      );
      const systemBalance = toNumber(balanceRows[0]?.balance ?? null);
      const lastMovementId = balanceRows[0]?.id ?? null;
      const totalCounted = round2(
        data.details.reduce(
          (sum, row) => sum + row.denomination * row.quantity,
          0,
        ),
      );

      // Un parámetro por columna (reusar `$n` con y sin cast hace fallar a
      // PostgreSQL con "inconsistent types"); el CHECK de la tabla garantiza
      // igualmente `difference = total_counted - system_balance`.
      const [count] = await manager.query<{ id: string }[]>(
        `INSERT INTO guayacan_cash_counts
           (business_date, total_counted, system_balance, difference, notes, client_request_id, created_by, last_movement_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          data.businessDate,
          totalCounted,
          systemBalance,
          round2(totalCounted - systemBalance),
          data.notes,
          data.clientRequestId,
          data.userId,
          lastMovementId,
        ],
      );

      for (const row of data.details) {
        await manager.query(
          `INSERT INTO guayacan_cash_count_details (count_id, denomination, quantity, subtotal)
           VALUES ($1, $2, $3, $4)`,
          [
            count.id,
            row.denomination,
            row.quantity,
            round2(row.denomination * row.quantity),
          ],
        );
      }
      return count.id;
    });
  }

  async findLatestCount(): Promise<GuayacanCashCountRow | null> {
    const rows = await this.dataSource.query<{ id: string }[]>(
      'SELECT id FROM guayacan_cash_counts ORDER BY sequence DESC LIMIT 1',
    );
    return rows[0] ? this.findCountById(rows[0].id) : null;
  }

  async findCountById(id: string): Promise<GuayacanCashCountRow | null> {
    const rows = await this.dataSource.query<CountSqlRow[]>(
      `SELECT ${COUNT_COLUMNS} ${COUNT_FROM} WHERE c.id = $1`,
      [id],
    );
    if (!rows[0]) {
      return null;
    }
    const details = await this.dataSource.query<
      { denomination: string; quantity: number; subtotal: string }[]
    >(
      `SELECT denomination, quantity, subtotal FROM guayacan_cash_count_details
       WHERE count_id = $1 ORDER BY denomination DESC`,
      [id],
    );
    return { ...toCount(rows[0]), details: toDenominations(details) };
  }

  async findCounts(
    options: FindGuayacanCashCountsOptions,
  ): Promise<PaginatedGuayacanCashCounts> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (options.startDate) {
      params.push(options.startDate);
      conditions.push(
        `(c.created_at AT TIME ZONE 'America/Guatemala')::date >= $${params.length}`,
      );
    }
    if (options.endDate) {
      params.push(options.endDate);
      conditions.push(
        `(c.created_at AT TIME ZONE 'America/Guatemala')::date <= $${params.length}`,
      );
    }
    if (options.userId) {
      params.push(options.userId);
      conditions.push(`c.created_by = $${params.length}`);
    }
    if (options.sequence !== undefined) {
      params.push(options.sequence);
      conditions.push(`c.sequence = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalRows = await this.dataSource.query<{ total: string }[]>(
      `SELECT count(*) AS total FROM guayacan_cash_counts c ${where}`,
      params,
    );
    const pageParams = [
      ...params,
      options.limit,
      (options.page - 1) * options.limit,
    ];
    const rows = await this.dataSource.query<CountSqlRow[]>(
      `SELECT ${COUNT_COLUMNS} ${COUNT_FROM} ${where}
       ORDER BY c.sequence DESC
       LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`,
      pageParams,
    );
    return {
      items: rows.map(toCount),
      total: Number(totalRows[0]?.total ?? 0),
      page: options.page,
      limit: options.limit,
    };
  }

  findCountUsers(): Promise<{ id: string; username: string }[]> {
    return this.dataSource.query<{ id: string; username: string }[]>(
      `SELECT DISTINCT u.id, u.username FROM guayacan_cash_counts c
       JOIN users u ON u.id = c.created_by ORDER BY u.username`,
    );
  }

  async findCommissions(options: {
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedGuayacanCommissions> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (options.startDate) {
      params.push(options.startDate);
      conditions.push(`g.business_date >= $${params.length}`);
    }
    if (options.endDate) {
      params.push(options.endDate);
      conditions.push(`g.business_date <= $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const totalRows = await this.dataSource.query<{ total: string }[]>(
      `SELECT count(*) AS total FROM guayacan_commissions g ${where}`,
      params,
    );
    const pageParams = [
      ...params,
      options.limit,
      (options.page - 1) * options.limit,
    ];
    const rows = await this.dataSource.query<
      {
        id: string;
        operation_id: string;
        transaction_type_name: string;
        business_date: string;
        transaction_count: number;
        commission_rate: string;
        amount: string;
        status: 'VIGENTE' | 'ANULADO';
        voided_at: Date | null;
        void_reason: string | null;
        created_by_username: string | null;
        created_at: Date;
      }[]
    >(
      `SELECT g.id, g.operation_id, tt.name AS transaction_type_name,
              to_char(g.business_date, 'YYYY-MM-DD') AS business_date, g.transaction_count,
              g.commission_rate, g.amount, g.status, g.voided_at, g.void_reason,
              u.username AS created_by_username, g.created_at
       FROM guayacan_commissions g
       JOIN bank_deposit_operations o ON o.id = g.operation_id
       JOIN transaction_types tt ON tt.id = o.transaction_type_id
       JOIN users u ON u.id = g.created_by
       ${where}
       ORDER BY g.sequence DESC
       LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`,
      pageParams,
    );
    return {
      items: rows.map((row) => ({
        id: row.id,
        operationId: row.operation_id,
        transactionTypeName: row.transaction_type_name,
        businessDate: row.business_date,
        transactionCount: Number(row.transaction_count),
        commissionRate: toNumber(row.commission_rate),
        amount: toNumber(row.amount),
        status: row.status,
        voidedAt: row.voided_at,
        voidReason: row.void_reason,
        createdByUsername: row.created_by_username ?? '',
        createdAt: row.created_at,
      })),
      total: Number(totalRows[0]?.total ?? 0),
      page: options.page,
      limit: options.limit,
    };
  }

  private translate(error: unknown, movementId?: string): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    return guayacanCashBoxErrorFromMessage(message, movementId) ?? error;
  }
}
