import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  FindGuayacanCashMovementsOptions,
  GuayacanCashBoxRepository,
  GuayacanCashBoxSummary,
  GuayacanCashCountRow,
  GuayacanCashDenominationRow,
  GuayacanCashMovementDetail,
  GuayacanCashMovementRow,
  GuayacanCashMovementType,
  GuayacanPeriodSummary,
  PaginatedGuayacanCashMovements,
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
          total_amount: string;
          transaction_count: number;
          operation_date: string;
          is_voided: boolean;
        }[]
      >(
        `SELECT o.id, tt.name AS transaction_type_name, o.total_amount, o.transaction_count,
                to_char(o.operation_date, 'YYYY-MM-DD') AS operation_date, o.is_voided
         FROM bank_deposit_operations o
         JOIN transaction_types tt ON tt.id = o.transaction_type_id
         WHERE o.id = $1`,
        [movement.referenceId],
      );
      if (operations[0]) {
        const row = operations[0];
        operation = {
          id: row.id,
          transactionTypeName: row.transaction_type_name,
          totalAmount: toNumber(row.total_amount),
          transactionCount: Number(row.transaction_count),
          operationDate: row.operation_date,
          isVoided: row.is_voided,
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
    const [movements] = await this.dataSource.query<
      {
        commission_total: string;
        income_total: string;
        expense_total: string;
      }[]
    >(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE'), 0) AS commission_total,
         COALESCE(SUM(amount) FILTER (WHERE amount > 0 AND vigente), 0) AS income_total,
         COALESCE(-SUM(amount) FILTER (WHERE amount < 0 AND vigente), 0) AS expense_total
       FROM (
         -- Un movimiento anulado y su contrapartida (ANULACION / REVERSO_COMISION)
         -- se cancelan: ninguno cuenta como ingreso ni egreso del período.
         SELECT amount, movement_type, status,
                (status = 'VIGENTE' AND movement_type NOT IN ('ANULACION', 'REVERSO_COMISION')) AS vigente
         FROM guayacan_cash_movements
         WHERE business_date BETWEEN $1 AND $2
       ) m`,
      [startDate, endDate],
    );
    return {
      startDate,
      endDate,
      transactionCount: Number(operations?.transaction_count ?? 0),
      operationCount: Number(operations?.operation_count ?? 0),
      commissionTotal: toNumber(movements?.commission_total ?? null),
      incomeTotal: toNumber(movements?.income_total ?? null),
      expenseTotal: toNumber(movements?.expense_total ?? null),
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

      const balanceRows = await manager.query<{ balance: string | null }[]>(
        'SELECT balance_after AS balance FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1',
      );
      const systemBalance = toNumber(balanceRows[0]?.balance ?? null);
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
           (business_date, total_counted, system_balance, difference, notes, client_request_id, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          data.businessDate,
          totalCounted,
          systemBalance,
          round2(totalCounted - systemBalance),
          data.notes,
          data.clientRequestId,
          data.userId,
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
    const rows = await this.dataSource.query<
      {
        id: string;
        business_date: string;
        total_counted: string;
        system_balance: string;
        difference: string;
        notes: string | null;
        created_by_username: string | null;
        created_at: Date;
      }[]
    >(
      `SELECT c.id, to_char(c.business_date, 'YYYY-MM-DD') AS business_date, c.total_counted,
              c.system_balance, c.difference, c.notes, u.username AS created_by_username, c.created_at
       FROM guayacan_cash_counts c JOIN users u ON u.id = c.created_by
       WHERE c.id = $1`,
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
    const row = rows[0];
    return {
      id: row.id,
      businessDate: row.business_date,
      totalCounted: toNumber(row.total_counted),
      systemBalance: toNumber(row.system_balance),
      difference: toNumber(row.difference),
      notes: row.notes,
      createdByUsername: row.created_by_username ?? '',
      createdAt: row.created_at,
      details: toDenominations(details),
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
