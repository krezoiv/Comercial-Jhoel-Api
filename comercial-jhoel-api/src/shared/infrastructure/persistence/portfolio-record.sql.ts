import { EntityManager, QueryFailedError } from 'typeorm';
import {
  PortfolioCashMovement,
  PortfolioPaymentMethod,
  PortfolioRecordChange,
  PortfolioRecordTrace,
  PortfolioRecordType,
  PortfolioStatement,
  PortfolioStatementMovement,
  PortfolioStatementOptions,
  PortfolioTable,
  portfolioRecordErrorFromMessage,
} from '../../domain/portfolio-record';

/**
 * Raw-SQL helpers shared by the Cuentas por Cobrar and Activos repositories
 * (migration `1760009300000-PortfolioCashTraceability`). Writes go through
 * `update_portfolio_record` / `void_portfolio_record` — locks first (caja →
 * client → row), then one UPDATE whose triggers apply the cash rule, the
 * reversal and the history in the same transaction. Reads never recompute a
 * rule: the expected effect comes from `portfolio_row_cash_effect`.
 */

const RECORD_TYPE: Record<PortfolioTable, PortfolioRecordType> = {
  accounts_receivable: 'ACCOUNT_RECEIVABLE',
  assets: 'ASSET',
};

export interface PortfolioUpdateData {
  clientId?: string;
  date?: string;
  amount?: number;
  /** `undefined` keeps the description; `null` clears it. */
  description?: string | null;
  paymentMethod?: PortfolioPaymentMethod;
  reason?: string | null;
  userId: string;
}

/** The portfolio error a write failed with, or the original error. */
export function translatePortfolioWriteError(error: unknown): unknown {
  if (!(error instanceof QueryFailedError)) {
    return error;
  }
  const message =
    (error.driverError as { message?: string } | undefined)?.message ??
    error.message;
  return portfolioRecordErrorFromMessage(message) ?? error;
}

export async function updatePortfolioRecord(
  manager: EntityManager,
  table: PortfolioTable,
  id: string,
  data: PortfolioUpdateData,
): Promise<void> {
  await manager.query(
    'SELECT update_portfolio_record($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [
      table,
      id,
      data.clientId ?? null,
      data.date ?? null,
      data.amount ?? null,
      data.description !== undefined,
      data.description ?? null,
      data.paymentMethod ?? null,
      data.reason ?? null,
      data.userId,
    ],
  );
}

export async function voidPortfolioRecord(
  manager: EntityManager,
  table: PortfolioTable,
  id: string,
  reason: string,
  userId: string,
): Promise<void> {
  await manager.query('SELECT void_portfolio_record($1, $2, $3, $4)', [
    table,
    id,
    reason,
    userId,
  ]);
}

type Row = Record<string, unknown>;
const num = (value: unknown): number => Number(value ?? 0);
const numOrNull = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);
/** Raw column values are strings, numbers or dates. */
const str = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString();
  }
  return value instanceof Date ? value.toISOString() : JSON.stringify(value);
};

/** Traces of the given records of one table, keyed by record id. */
export async function loadPortfolioTraces(
  manager: EntityManager,
  table: PortfolioTable,
  ids: string[],
): Promise<Map<string, PortfolioRecordTrace>> {
  const traces = new Map<string, PortfolioRecordTrace>();
  if (ids.length === 0) {
    return traces;
  }
  const recordType = RECORD_TYPE[table];

  const records = await manager.query<Row[]>(
    `SELECT r.id, r.is_active, r.reference_type, r.reference_id, r.updated_at, uu.username AS updated_by_username,
            CASE WHEN r.reference_type = 'AR_PAYMENT' THEN (
              SELECT CASE WHEN po.payment_method = 'DEPOSITO_BANCARIO' THEN 'BANCO' ELSE 'EFECTIVO' END
              FROM account_receivable_payment_operations po WHERE po.id = r.reference_id)
            END AS operation_method,
            COALESCE(r.payment_method, 'EFECTIVO') AS payment_method,
            COALESCE(r.cash_tracked, EXISTS (
              SELECT 1 FROM cash_movements m WHERE m.reference_type = $2 AND m.reference_id = r.id)) AS cash_tracked,
            portfolio_row_cash_effect($3, r.movement_type, r.amount, r.is_active, r.payment_method,
              r.reference_type, r.reference_id) AS effect
     FROM ${table} r
     LEFT JOIN users uu ON uu.id = r.updated_by
     WHERE r.id = ANY ($1::uuid[])`,
    [ids, recordType, table],
  );

  const movements = await manager.query<Row[]>(
    `SELECT m.id, m.reference_id, m.sequence, m.movement_type, m.direction, m.amount, m.status, m.reason,
            m.reversal_of_id, m.created_at, u.username
     FROM cash_movements m
     JOIN users u ON u.id = m.created_by
     WHERE m.reference_type = $1 AND m.reference_id = ANY ($2::uuid[])
     ORDER BY m.sequence`,
    [recordType, ids],
  );

  const changes = await manager.query<Row[]>(
    `SELECT c.id, c.record_id, c.action, c.reason, c.changes, c.cash_tracked, c.cash_effect_before,
            c.cash_effect_after, c.cash_movement_ids, c.changed_at, u.username
     FROM portfolio_record_changes c
     JOIN users u ON u.id = c.changed_by
     WHERE c.record_type = $1 AND c.record_id = ANY ($2::uuid[])
     ORDER BY c.changed_at, c.id`,
    [recordType, ids],
  );

  const movementsOf = new Map<string, PortfolioCashMovement[]>();
  for (const row of movements) {
    const list = movementsOf.get(String(row.reference_id)) ?? [];
    list.push({
      id: String(row.id),
      sequence: num(row.sequence),
      movementType: String(row.movement_type),
      direction: String(row.direction) as PortfolioCashMovement['direction'],
      amount: num(row.amount),
      status: String(row.status) as PortfolioCashMovement['status'],
      reason: str(row.reason),
      reversalOfId: str(row.reversal_of_id),
      createdAt: row.created_at as Date,
      username: String(row.username),
    });
    movementsOf.set(String(row.reference_id), list);
  }

  const changesOf = new Map<string, PortfolioRecordChange[]>();
  for (const row of changes) {
    const list = changesOf.get(String(row.record_id)) ?? [];
    list.push({
      id: String(row.id),
      action: String(row.action) as PortfolioRecordChange['action'],
      reason: str(row.reason),
      changes: (row.changes ?? {}) as PortfolioRecordChange['changes'],
      cashTracked: Boolean(row.cash_tracked),
      cashEffectBefore: numOrNull(row.cash_effect_before),
      cashEffectAfter: numOrNull(row.cash_effect_after),
      cashMovementIds: (row.cash_movement_ids as string[] | null) ?? [],
      changedByUsername: String(row.username),
      changedAt: row.changed_at as Date,
    });
    changesOf.set(String(row.record_id), list);
  }

  for (const row of records) {
    const id = String(row.id);
    const recordMovements = movementsOf.get(id) ?? [];
    const recordChanges = changesOf.get(id) ?? [];
    const tracked = Boolean(row.cash_tracked);
    const isActive = Boolean(row.is_active);
    const referenceType = str(row.reference_type);
    const voidChange = [...recordChanges]
      .reverse()
      .find((change) => change.action === 'ANULADO');
    traces.set(id, {
      recordId: id,
      isActive,
      paymentMethod: (str(row.operation_method) ??
        String(row.payment_method)) as PortfolioPaymentMethod,
      cashTracked: tracked,
      cashEffect: tracked ? num(row.effect) : null,
      kardexNet: recordMovements.reduce(
        (sum, m) =>
          sum +
          (m.direction === 'IN'
            ? m.amount
            : m.direction === 'OUT'
              ? -m.amount
              : 0),
        0,
      ),
      lock:
        referenceType === 'BANK_DEPOSIT' || referenceType === 'AR_PAYMENT'
          ? referenceType
          : null,
      operationId:
        referenceType === 'BANK_DEPOSIT' ? str(row.reference_id) : null,
      voided: isActive
        ? null
        : voidChange
          ? {
              at: voidChange.changedAt,
              byUsername: voidChange.changedByUsername,
              reason: voidChange.reason,
            }
          : {
              // Voided before the change history existed: who/when from the row itself, no reason recorded.
              at: row.updated_at as Date,
              byUsername: str(row.updated_by_username),
              reason: null,
            },
      movements: recordMovements,
      changes: recordChanges,
    });
  }
  return traces;
}

/**
 * Client statement of one table: every row of the period in order, voided
 * rows included (they keep their place, never count in the balance), each with
 * its trace (payment method, Kardex movements, change history).
 */
export async function loadPortfolioStatement(
  manager: EntityManager,
  table: PortfolioTable,
  clientId: string,
  options: PortfolioStatementOptions,
): Promise<PortfolioStatement> {
  const dateFrom = options.dateFrom ?? null;
  const dateTo = options.dateTo ?? null;
  const includeVoided = options.includeVoided ?? true;

  const [header] = await manager.query<
    { clientName: string | null; openingBalance: string }[]
  >(
    `SELECT
       (SELECT name FROM clients WHERE id = $1) AS "clientName",
       COALESCE((
         SELECT SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END)
         FROM ${table}
         WHERE client_id = $1 AND is_active = true
           AND $2::date IS NOT NULL AND date < $2::date
       ), 0) AS "openingBalance"`,
    [clientId, dateFrom],
  );
  const openingBalance = Number(header?.openingBalance ?? 0);

  const rows = await manager.query<Row[]>(
    `SELECT a.id, a.date, a.movement_type, a.description, a.amount, a.is_active, a.created_at,
            u.username AS created_by_username,
            CASE WHEN a.is_active THEN
              $4::numeric + SUM(CASE WHEN NOT a.is_active THEN 0
                                     WHEN a.movement_type = 'ABONO' THEN -a.amount ELSE a.amount END)
                              OVER (ORDER BY a.sequence)
            END AS balance_after
     FROM ${table} a
     JOIN users u ON u.id = a.created_by
     WHERE a.client_id = $1
       AND ($2::date IS NULL OR a.date >= $2::date)
       AND ($3::date IS NULL OR a.date <= $3::date)
       AND ($5::boolean OR a.is_active)
     ORDER BY a.sequence`,
    [clientId, dateFrom, dateTo, openingBalance, includeVoided],
  );

  const traces = await loadPortfolioTraces(
    manager,
    table,
    rows.map((row) => String(row.id)),
  );

  const movements: PortfolioStatementMovement[] = rows.map((row) => ({
    id: String(row.id),
    // Raw value exactly as the previous statement returned it (the pg driver's DATE parsing).
    date: row.date as string,
    movementType: String(row.movement_type) as 'CARGO' | 'ABONO',
    description: str(row.description),
    amount: num(row.amount),
    balanceAfter: numOrNull(row.balance_after),
    isActive: Boolean(row.is_active),
    createdByUsername: String(row.created_by_username),
    createdAt: row.created_at as Date,
    trace: traces.get(String(row.id))!,
  }));

  const active = movements.filter((m) => m.isActive);
  const totalCargos = active
    .filter((m) => m.movementType === 'CARGO')
    .reduce((sum, m) => sum + m.amount, 0);
  const totalAbonos = active
    .filter((m) => m.movementType === 'ABONO')
    .reduce((sum, m) => sum + m.amount, 0);

  return {
    clientId,
    clientName: header?.clientName ?? '',
    openingBalance,
    movements,
    totalCargos: round2(totalCargos),
    totalAbonos: round2(totalAbonos),
    closingBalance: round2(openingBalance + totalCargos - totalAbonos),
    voidedCount: movements.length - active.length,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
