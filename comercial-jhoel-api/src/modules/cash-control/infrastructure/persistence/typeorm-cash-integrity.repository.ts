import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import type {
  IntegrityClassification,
  IntegrityResolution,
  SourceComparison,
  TimelineCount,
} from '../../domain/cash-integrity';
import type {
  CashIntegrityRepository,
  ChainBreak,
  IntegrityScope,
  OpeningStatus,
  PossibleDuplicate,
  RegisterOpeningCountData,
  ResolveDifferenceData,
  SignViolation,
  SnapshotMismatch,
} from '../../domain/repositories/cash-integrity.repository';
import { cashControlErrorFromMessage } from '../../domain/errors/cash-control.errors';

type SqlRow = Record<string, unknown>;

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
const str = (value: unknown): string | null =>
  value === null || value === undefined ? null : text(value);
const date = (value: unknown): Date | null =>
  value === null || value === undefined ? null : new Date(value as string);

/** Kardex rows of the scope. */
const IN_SCOPE = `m.sequence > $1::bigint AND ($2::bigint IS NULL OR m.sequence <= $2::bigint)`;
/** Rows created in the scope's time window (its start / end are query parameters `start` and `end`). */
const IN_WINDOW = (column: string, start = 3, end = 4) =>
  `(${column} >= $${start}::timestamptz AND ($${end}::timestamptz IS NULL OR ${column} < $${end}::timestamptz))`;
/** Same, for a query that only receives the window: $1 start, $2 end. */
const IN_WINDOW_ONLY = (column: string) => IN_WINDOW(column, 1, 2);

/** Types whose direction is fixed by the code that writes them. */
const FIXED_DIRECTION: Record<string, 'IN' | 'OUT'> = {
  ENTRADA_MANUAL: 'IN',
  SALIDA_MANUAL: 'OUT',
  SALDO_INICIAL: 'IN',
  GASTO_POR_COBRAR: 'OUT',
  ABONO_POR_COBRAR: 'IN',
  ACTIVO: 'IN',
  DEVOLUCION_ACTIVO: 'OUT',
  RETIRO_BANCARIO: 'IN',
  DEPOSITO_BANCARIO: 'OUT',
  ENTREGA_BODEGA: 'OUT',
  DEVOLUCION_BODEGA: 'IN',
};

/**
 * Every source operation that must (or must not) move Caja, with the effect its
 * own rules give it — mirror of the Kardex triggers:
 * - Transaccionar: the type's `cash_effect` (Guayacán never; voided = 0).
 * - CxC: ABONO in, CARGO out (a bank-deposit collection never; inactive = 0).
 * - Activos: CARGO in, ABONO out (inactive = 0).
 * - Bank withdrawal to caja (RETIRO_EFECTIVO): in (voided = 0).
 * - Caja → Bodega: out; Bodega → Caja: in (voided = 0).
 * `expects_row`: created after that kind of operation started reaching the
 * Kardex (older rows were never tracked — no backfill — so they are skipped).
 */
const SOURCES = `
  WITH refs AS (
    SELECT DISTINCT m.reference_type, m.reference_id FROM cash_movements m
    WHERE ${IN_SCOPE} AND m.reference_type IS NOT NULL
  ),
  cutoff AS (
    SELECT reference_type, min(created_at) AS since FROM cash_movements
    WHERE reference_type IS NOT NULL GROUP BY reference_type
  ),
  src AS (
    SELECT 'BANK_DEPOSIT'::text AS reference_type, o.id AS reference_id, o.created_at AS occurred_at,
           u.username,
           t.name || ' de Q' || to_char(o.total_amount, 'FM999,999,990.00')
             || COALESCE(' — ' || NULLIF(btrim(o.description), ''), COALESCE(' — ' || NULLIF(btrim(o.client_name), ''), ''))
             AS label,
           CASE WHEN o.is_voided OR tb.cash_box_code = 'GUAYACAN' THEN 0
                WHEN t.cash_effect = 'IN' THEN o.total_amount
                WHEN t.cash_effect = 'OUT' THEN -o.total_amount ELSE 0 END AS expected_net,
           o.created_at >= COALESCE((SELECT since FROM cutoff WHERE reference_type = 'BANK_DEPOSIT'), 'infinity') AS expects_row,
           CASE WHEN tb.cash_box_code = 'GUAYACAN' THEN 'Cooperativa Guayacán tiene su propia caja'
                WHEN o.is_voided THEN 'Operación anulada: su efecto neto debe ser Q0.00'
                WHEN t.cash_effect = 'IN' THEN t.name || ' entra a Caja'
                WHEN t.cash_effect = 'OUT' THEN t.name || ' sale de Caja'
                ELSE t.name || ' no mueve efectivo' END AS rule
    FROM bank_deposit_operations o
    JOIN transaction_types t ON t.id = o.transaction_type_id
    LEFT JOIN transaction_banks tb ON tb.id = o.transaction_bank_id
    JOIN users u ON u.id = o.user_id
    WHERE ${IN_WINDOW('o.created_at')} OR ('BANK_DEPOSIT', o.id) IN (SELECT reference_type, reference_id FROM refs)
    UNION ALL
    SELECT 'ACCOUNT_RECEIVABLE', r.id, r.created_at, u.username,
           CASE WHEN r.movement_type = 'ABONO' THEN 'Abono por cobrar' ELSE 'Gasto por cobrar' END
             || ' de Q' || to_char(r.amount, 'FM999,999,990.00') || COALESCE(' — ' || c.name, ''),
           CASE WHEN NOT r.is_active OR bank_paid THEN 0
                WHEN r.movement_type = 'ABONO' THEN r.amount ELSE -r.amount END,
           r.created_at >= COALESCE((SELECT since FROM cutoff WHERE reference_type = 'ACCOUNT_RECEIVABLE'), 'infinity')
             AND r.is_active AND NOT bank_paid,
           CASE WHEN bank_paid THEN 'Cobro por depósito bancario: no entra a Caja'
                WHEN NOT r.is_active THEN 'Registro desactivado: su efecto neto debe ser Q0.00'
                WHEN r.movement_type = 'ABONO' THEN 'Un abono por cobrar entra a Caja'
                ELSE 'Un gasto por cobrar sale de Caja' END
    FROM (
      SELECT r.*, (r.reference_type = 'AR_PAYMENT' AND EXISTS (
               SELECT 1 FROM account_receivable_payment_operations po
               WHERE po.id = r.reference_id AND po.payment_method = 'DEPOSITO_BANCARIO')) AS bank_paid
      FROM accounts_receivable r
      WHERE ${IN_WINDOW('r.created_at')} OR ('ACCOUNT_RECEIVABLE', r.id) IN (SELECT reference_type, reference_id FROM refs)
    ) r
    JOIN users u ON u.id = r.created_by
    LEFT JOIN clients c ON c.id = r.client_id
    UNION ALL
    SELECT 'ASSET', a.id, a.created_at, u.username,
           CASE WHEN a.movement_type = 'ABONO' THEN 'Devolución de activo' ELSE 'Activo' END
             || ' de Q' || to_char(a.amount, 'FM999,999,990.00') || COALESCE(' — ' || c.name, ''),
           CASE WHEN NOT a.is_active THEN 0 WHEN a.movement_type = 'ABONO' THEN -a.amount ELSE a.amount END,
           a.created_at >= COALESCE((SELECT since FROM cutoff WHERE reference_type = 'ASSET'), 'infinity') AND a.is_active,
           CASE WHEN NOT a.is_active THEN 'Registro desactivado: su efecto neto debe ser Q0.00'
                WHEN a.movement_type = 'ABONO' THEN 'Una devolución de activo sale de Caja'
                ELSE 'Un activo entra a Caja' END
    FROM assets a
    JOIN users u ON u.id = a.created_by
    LEFT JOIN clients c ON c.id = a.client_id
    WHERE ${IN_WINDOW('a.created_at')} OR ('ASSET', a.id) IN (SELECT reference_type, reference_id FROM refs)
    UNION ALL
    SELECT 'BANK_MOVEMENT', bm.id, bm.created_at, u.username,
           'Retiro de efectivo en ' || b.name || ' de Q' || to_char(abs(bm.amount), 'FM999,999,990.00'),
           CASE WHEN bm.status = 'APLICADO' THEN abs(bm.amount) ELSE 0 END,
           bm.created_at >= COALESCE((SELECT since FROM cutoff WHERE reference_type = 'BANK_MOVEMENT'), 'infinity'),
           CASE WHEN bm.status = 'APLICADO' THEN 'Un retiro de efectivo en banco entra a Caja'
                ELSE 'Retiro anulado: su efecto neto debe ser Q0.00' END
    FROM bank_account_movements bm
    JOIN banks b ON b.id = bm.bank_id
    JOIN users u ON u.id = bm.user_id
    WHERE bm.movement_type = 'RETIRO_EFECTIVO'
      AND (${IN_WINDOW('bm.created_at')} OR ('BANK_MOVEMENT', bm.id) IN (SELECT reference_type, reference_id FROM refs))
    UNION ALL
    SELECT 'WAREHOUSE_TRANSFER', w.id, w.created_at, u.username,
           'Traslado a Bodega ' || w.reference_number || ' de Q' || to_char(w.amount, 'FM999,999,990.00'),
           CASE WHEN w.status = 'APLICADO' THEN -w.amount ELSE 0 END,
           TRUE,
           CASE WHEN w.status = 'APLICADO' THEN 'Un traslado de Caja a Bodega sale de Caja'
                ELSE 'Traslado anulado: su efecto neto debe ser Q0.00' END
    FROM cash_warehouse_transfers w
    JOIN users u ON u.id = w.created_by
    WHERE ${IN_WINDOW('w.created_at')} OR ('WAREHOUSE_TRANSFER', w.id) IN (SELECT reference_type, reference_id FROM refs)
    UNION ALL
    SELECT 'WAREHOUSE_WITHDRAWAL', w.id, w.created_at, u.username,
           'Retiro de Bodega ' || w.reference_number || ' de Q' || to_char(w.amount, 'FM999,999,990.00')
             || CASE WHEN w.destination = 'CAJA' THEN ' a Caja' ELSE ' a banco' END,
           CASE WHEN w.destination = 'CAJA' AND w.status = 'APLICADO' THEN w.amount ELSE 0 END,
           w.destination = 'CAJA',
           CASE WHEN w.destination <> 'CAJA' THEN 'Un retiro de Bodega a banco no pasa por Caja'
                WHEN w.status = 'APLICADO' THEN 'Un retiro de Bodega a Caja entra a Caja'
                ELSE 'Retiro anulado: su efecto neto debe ser Q0.00' END
    FROM warehouse_cash_withdrawals w
    JOIN users u ON u.id = w.created_by
    WHERE ${IN_WINDOW('w.created_at')} OR ('WAREHOUSE_WITHDRAWAL', w.id) IN (SELECT reference_type, reference_id FROM refs)
  ),
  k AS (
    SELECT m.reference_type, m.reference_id,
           SUM(CASE m.direction WHEN 'IN' THEN m.amount WHEN 'OUT' THEN -m.amount ELSE 0 END) AS net,
           count(*) AS rows,
           count(*) FILTER (WHERE m.status = 'VIGENTE' AND m.movement_type <> 'ANULACION' AND m.direction <> 'NONE') AS active_rows,
           array_agg(m.id::text ORDER BY m.sequence) AS ids
    FROM cash_movements m
    WHERE (m.reference_type, m.reference_id) IN (SELECT reference_type, reference_id FROM src)
    GROUP BY m.reference_type, m.reference_id
  )
  SELECT s.*, COALESCE(k.net, 0) AS kardex_net, COALESCE(k.rows, 0) AS rows,
         COALESCE(k.active_rows, 0) AS active_rows, COALESCE(k.ids, '{}') AS ids
  FROM src s
  LEFT JOIN k ON k.reference_type = s.reference_type AND k.reference_id = s.reference_id
`;

/** Caja counts of the timeline: arqueos (with their opening flag) and the current count of every finished cut. */
const CAJA_COUNTS = `
  SELECT 'ARQUEO_CAJA'::text AS source, c.id,
         CASE WHEN o.id IS NULL THEN 'Arqueo de Caja #' || c.number ELSE 'Arqueo de apertura #' || c.number END AS label,
         c.counted_at, c.last_cash_sequence AS sequence, c.system_cash AS theoretical, c.total_counted AS counted,
         c.difference, u.username, (o.id IS NOT NULL) AS is_opening
  FROM cash_counts c
  JOIN users u ON u.id = c.created_by
  LEFT JOIN cash_opening_counts o ON o.count_id = c.id
  WHERE c.status = 'VIGENTE'
  UNION ALL
  SELECT 'CORTE', k.id, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY'),
         k.created_at, p.closing_sequence, k.system_cash, k.total_counted, k.difference, u.username, FALSE
  FROM cash_cut_counts k
  JOIN cash_cut_periods p ON p.id = k.cut_period_id
  JOIN cash_operational_days d ON d.id = p.operational_day_id
  JOIN users u ON u.id = k.created_by
  WHERE k.is_current AND p.status = 'FINALIZADO' AND p.closing_sequence IS NOT NULL
`;

const BODEGA_COUNTS = `
  SELECT 'ARQUEO_BODEGA'::text AS source, a.id, 'Arqueo de Bodega #' || a.number AS label, a.counted_at,
         a.warehouse_sequence AS sequence, a.theoretical_balance AS theoretical, a.total_counted AS counted,
         a.difference, u.username, FALSE AS is_opening
  FROM warehouse_cash_audits a JOIN users u ON u.id = a.created_by
`;

/**
 * Raw-SQL adapter of the cash audit. Every check is a read-only query over the
 * official records; the only writes are `register_cash_opening_count` and
 * `resolve_cash_count_difference` (SQL functions with their own rules).
 */
@Injectable()
export class TypeOrmCashIntegrityRepository implements CashIntegrityRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private params(scope: IntegrityScope): unknown[] {
    return [
      scope.afterSequence,
      scope.upToSequence,
      scope.windowStart,
      scope.windowEnd,
    ];
  }

  async findChainBreaks(scope: IntegrityScope): Promise<ChainBreak[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT m.id, m.sequence, m.movement_type, m.created_at, u.username, m.previous_balance,
              COALESCE(p.new_balance, 0) AS expected_previous
       FROM cash_movements m
       JOIN users u ON u.id = m.created_by
       LEFT JOIN LATERAL (
         SELECT x.new_balance FROM cash_movements x WHERE x.sequence < m.sequence ORDER BY x.sequence DESC LIMIT 1
       ) p ON TRUE
       WHERE ${IN_SCOPE} AND m.previous_balance <> COALESCE(p.new_balance, 0)
       ORDER BY m.sequence`,
      [scope.afterSequence, scope.upToSequence],
    );
    return rows.map((row) => ({
      id: text(row.id),
      sequence: num(row.sequence),
      movementType: text(row.movement_type),
      createdAt: date(row.created_at)!,
      username: text(row.username),
      previousBalance: num(row.previous_balance),
      expectedPrevious: num(row.expected_previous),
    }));
  }

  async findSignViolations(scope: IntegrityScope): Promise<SignViolation[]> {
    const fixed = Object.entries(FIXED_DIRECTION);
    const rows = await this.dataSource.query<SqlRow[]>(
      `WITH fixed(movement_type, expected) AS (
         SELECT * FROM unnest($3::text[], $4::text[])
       )
       SELECT m.id, m.sequence, 'SIGN'::text AS kind, m.movement_type, m.direction, f.expected AS expected_direction,
              m.amount, m.created_at, u.username, m.description
       FROM cash_movements m JOIN fixed f ON f.movement_type = m.movement_type JOIN users u ON u.id = m.created_by
       WHERE ${IN_SCOPE} AND m.direction <> f.expected
       UNION ALL
       -- An annulment must mirror its original: opposite direction, same amount, original ANULADO.
       SELECT m.id, m.sequence, 'REVERSAL_MISMATCH', m.movement_type, m.direction,
              CASE o.direction WHEN 'IN' THEN 'OUT' WHEN 'OUT' THEN 'IN' ELSE 'NONE' END,
              m.amount, m.created_at, u.username, m.description
       FROM cash_movements m JOIN cash_movements o ON o.id = m.reversal_of_id JOIN users u ON u.id = m.created_by
       WHERE ${IN_SCOPE} AND m.movement_type = 'ANULACION'
         AND (m.amount <> o.amount OR o.status <> 'ANULADO'
              OR m.direction <> CASE o.direction WHEN 'IN' THEN 'OUT' WHEN 'OUT' THEN 'IN' ELSE 'NONE' END)
       UNION ALL
       -- An original marked ANULADO without its annulment row: its money never came back.
       SELECT m.id, m.sequence, 'REVERSAL_MISSING', m.movement_type, m.direction, NULL,
              m.amount, m.created_at, u.username, m.description
       FROM cash_movements m JOIN users u ON u.id = m.created_by
       WHERE ${IN_SCOPE} AND m.status = 'ANULADO' AND m.direction <> 'NONE'
         AND NOT EXISTS (SELECT 1 FROM cash_movements r WHERE r.reversal_of_id = m.id)
       ORDER BY 2`,
      [
        scope.afterSequence,
        scope.upToSequence,
        fixed.map(([type]) => type),
        fixed.map(([, direction]) => direction),
      ],
    );
    return rows.map((row) => ({
      id: text(row.id),
      sequence: num(row.sequence),
      kind: text(row.kind) as SignViolation['kind'],
      movementType: text(row.movement_type),
      direction: text(row.direction),
      expectedDirection: str(row.expected_direction),
      amount: num(row.amount),
      createdAt: date(row.created_at)!,
      username: text(row.username),
      description: text(row.description),
    }));
  }

  async findSourceComparisons(
    scope: IntegrityScope,
  ): Promise<SourceComparison[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `${SOURCES} ORDER BY s.occurred_at`,
      this.params(scope),
    );
    return rows.map((row) => ({
      referenceType: text(row.reference_type),
      referenceId: text(row.reference_id),
      label: text(row.label),
      occurredAt: date(row.occurred_at)!,
      username: str(row.username),
      expectedNet: num(row.expected_net),
      kardexNet: num(row.kardex_net),
      rows: num(row.rows),
      activeRows: num(row.active_rows),
      expectsRow: row.expects_row === true,
      movementIds: (row.ids as string[]) ?? [],
      rule: text(row.rule),
    }));
  }

  async findPossibleDuplicates(
    scope: IntegrityScope,
    minutes: number,
  ): Promise<PossibleDuplicate[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT a.id AS first_id, m.id AS second_id, m.movement_type, m.amount, m.direction, m.description,
              u.username, a.created_at AS first_at, m.created_at AS second_at
       FROM cash_movements m
       JOIN cash_movements a ON a.sequence < m.sequence
        AND a.movement_type = m.movement_type AND a.direction = m.direction AND a.amount = m.amount
        AND a.created_by = m.created_by AND a.description = m.description
        AND a.created_at >= m.created_at - make_interval(mins => $3::int)
        AND a.status = 'VIGENTE'
        AND (a.reference_id IS NULL OR m.reference_id IS NULL OR a.reference_id <> m.reference_id)
       JOIN users u ON u.id = m.created_by
       WHERE ${IN_SCOPE} AND m.status = 'VIGENTE' AND m.direction <> 'NONE'
         AND m.movement_type NOT IN ('ANULACION', 'SALDO_INICIAL')
       ORDER BY m.sequence`,
      [scope.afterSequence, scope.upToSequence, minutes],
    );
    return rows.map((row) => ({
      firstId: text(row.first_id),
      secondId: text(row.second_id),
      movementType: text(row.movement_type),
      amount: num(row.amount),
      direction: text(row.direction),
      description: text(row.description),
      username: text(row.username),
      firstAt: date(row.first_at)!,
      secondAt: date(row.second_at)!,
    }));
  }

  async findSnapshotMismatches(
    scope: IntegrityScope,
  ): Promise<SnapshotMismatch[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT * FROM (
         -- Cuts: their stored opening / closing / totals vs the Kardex range they cover.
         SELECT 'CUT_CLOSE:' || p.id AS key, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY')
                  || ' — saldo del sistema al finalizar' AS label,
                p.closing_system_cash AS stored, cash_balance_at(p.closing_sequence) AS kardex,
                p.actual_finished_at AS occurred_at, u.username, FALSE AS historical
         FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
         LEFT JOIN users u ON u.id = p.closed_by
         WHERE p.status = 'FINALIZADO' AND p.closing_sequence IS NOT NULL AND ${IN_WINDOW_ONLY('p.actual_finished_at')}
         UNION ALL
         SELECT 'CUT_OPEN:' || p.id, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY')
                  || ' — saldo del sistema al iniciar',
                p.opening_system_cash, cash_balance_at(p.start_sequence), p.actual_started_at, u.username, FALSE
         FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
         LEFT JOIN users u ON u.id = p.opened_by
         WHERE p.start_sequence IS NOT NULL AND p.opening_system_cash IS NOT NULL AND ${IN_WINDOW_ONLY('p.actual_started_at')}
         UNION ALL
         SELECT 'CUT_IN:' || p.id, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY')
                  || ' — entradas del corte',
                p.total_in, (SELECT COALESCE(SUM(m.amount), 0) FROM cash_movements m
                             WHERE m.direction = 'IN' AND m.sequence > p.start_sequence AND m.sequence <= p.closing_sequence),
                p.actual_finished_at, u.username, FALSE
         FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
         LEFT JOIN users u ON u.id = p.closed_by
         WHERE p.status = 'FINALIZADO' AND p.closing_sequence IS NOT NULL AND ${IN_WINDOW_ONLY('p.actual_finished_at')}
         UNION ALL
         SELECT 'CUT_OUT:' || p.id, 'Corte ' || p.period_number || ' · ' || to_char(d.operational_date, 'DD/MM/YYYY')
                  || ' — salidas del corte',
                p.total_out, (SELECT COALESCE(SUM(m.amount), 0) FROM cash_movements m
                              WHERE m.direction = 'OUT' AND m.sequence > p.start_sequence AND m.sequence <= p.closing_sequence),
                p.actual_finished_at, u.username, FALSE
         FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
         LEFT JOIN users u ON u.id = p.closed_by
         WHERE p.status = 'FINALIZADO' AND p.closing_sequence IS NOT NULL AND ${IN_WINDOW_ONLY('p.actual_finished_at')}
         UNION ALL
         -- Cash days of the cuts.
         SELECT 'DAY_OPEN:' || d.id, 'Día de cortes ' || to_char(d.operational_date, 'DD/MM/YYYY') || ' — saldo del sistema en la apertura',
                d.opening_system_cash, cash_balance_at(d.opening_sequence), d.opened_at, u.username, FALSE
         FROM cash_operational_days d LEFT JOIN users u ON u.id = d.opened_by
         WHERE d.opening_sequence IS NOT NULL AND ${IN_WINDOW_ONLY('d.opened_at')}
         UNION ALL
         SELECT 'DAY_CLOSE:' || d.id, 'Día de cortes ' || to_char(d.operational_date, 'DD/MM/YYYY') || ' — saldo del sistema al cerrar',
                d.closing_system_cash, cash_balance_at(d.closing_sequence), d.closed_at, u.username, FALSE
         FROM cash_operational_days d LEFT JOIN users u ON u.id = d.closed_by
         WHERE d.closing_sequence IS NOT NULL AND d.closing_system_cash IS NOT NULL AND ${IN_WINDOW_ONLY('d.closed_at')}
         UNION ALL
         -- Arqueos: the theoretical they photographed vs the Kardex at their sequence.
         SELECT 'COUNT:' || c.id, 'Arqueo de Caja #' || c.number || ' — saldo teórico fotografiado',
                c.system_cash, cash_balance_at(c.last_cash_sequence), c.counted_at, u.username, FALSE
         FROM cash_counts c JOIN users u ON u.id = c.created_by
         WHERE c.replaces_id IS NULL AND ${IN_WINDOW_ONLY('c.counted_at')}
         UNION ALL
         -- Bank-day openings (daily indicators): the balance stored at the opening vs the Kardex.
         SELECT 'ANCHOR:' || a.id, 'Apertura bancaria ' || to_char(a.business_date, 'DD/MM/YYYY') || ' — saldo de Caja guardado',
                a.opening_cash_balance, cash_balance_at(a.opening_sequence), a.opened_at, u.username, a.source = 'BACKFILL'
         FROM cash_bank_day_openings a JOIN users u ON u.id = a.opened_by
         WHERE ${IN_WINDOW_ONLY('a.opened_at')}
       ) x
       WHERE x.stored IS DISTINCT FROM x.kardex
       ORDER BY x.occurred_at`,
      [scope.windowStart, scope.windowEnd],
    );
    return rows.map((row) => ({
      key: text(row.key),
      label: text(row.label),
      stored: num(row.stored),
      kardex: num(row.kardex),
      occurredAt: date(row.occurred_at),
      username: str(row.username),
      historical: row.historical === true,
    }));
  }

  private async timeline(
    source: string,
    resolutionSources: string[],
    scope: IntegrityScope,
  ): Promise<{ previous: TimelineCount | null; counts: TimelineCount[] }> {
    // `sources` is the parameter number holding the allowed resolution sources.
    const select = (sources: number) => `
      SELECT x.*, r.id AS resolution_id, r.cause, r.explanation, r.adjustment_movement_id,
             ru.username AS resolved_by, r.created_at AS resolved_at
      FROM (${source}) x
      LEFT JOIN cash_difference_resolutions r ON r.count_source = x.source AND r.count_id = x.id
        AND r.count_source = ANY($${sources}::text[])
      LEFT JOIN users ru ON ru.id = r.created_by`;
    const [previous] = await this.dataSource.query<SqlRow[]>(
      `${select(2)} WHERE x.counted_at < $1 ORDER BY x.counted_at DESC, x.sequence DESC LIMIT 1`,
      [scope.windowStart, resolutionSources],
    );
    const counts = await this.dataSource.query<SqlRow[]>(
      `${select(3)} WHERE x.counted_at >= $1 AND ($2::timestamptz IS NULL OR x.counted_at < $2::timestamptz)
       ORDER BY x.counted_at, x.sequence`,
      [scope.windowStart, scope.windowEnd, resolutionSources],
    );
    return {
      previous: previous ? this.toTimeline(previous) : null,
      counts: counts.map((row) => this.toTimeline(row)),
    };
  }

  findCajaTimeline(scope: IntegrityScope) {
    return this.timeline(CAJA_COUNTS, ['ARQUEO_CAJA', 'CORTE'], scope);
  }

  findBodegaTimeline(scope: IntegrityScope) {
    return this.timeline(BODEGA_COUNTS, ['ARQUEO_BODEGA'], scope);
  }

  private toTimeline(row: SqlRow): TimelineCount {
    const resolution: IntegrityResolution | null = row.resolution_id
      ? {
          id: text(row.resolution_id),
          cause: text(row.cause) as IntegrityClassification,
          explanation: text(row.explanation),
          adjustmentMovementId: str(row.adjustment_movement_id),
          username: text(row.resolved_by),
          createdAt: date(row.resolved_at)!,
        }
      : null;
    return {
      source: text(row.source) as TimelineCount['source'],
      id: text(row.id),
      label: text(row.label),
      countedAt: date(row.counted_at)!,
      sequence: num(row.sequence),
      theoretical: num(row.theoretical),
      counted: num(row.counted),
      difference: num(row.difference),
      username: text(row.username),
      isOpening: row.is_opening === true,
      resolution,
    };
  }

  async findSequences(ids: string[]): Promise<Map<string, number>> {
    if (!ids.length) {
      return new Map();
    }
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT id, sequence FROM cash_movements WHERE id = ANY($1::uuid[])`,
      [ids],
    );
    return new Map(rows.map((row) => [text(row.id), num(row.sequence)]));
  }

  async getOpeningStatus(dayOpeningId?: string): Promise<OpeningStatus | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT a.day_opening_id, to_char(a.business_date, 'YYYY-MM-DD') AS business_date, a.opened_at,
              cash_balance_at(a.opening_sequence) AS previous_close, cash_balance() AS current_theoretical,
              (SELECT count(*) FROM cash_movements m WHERE m.direction <> 'NONE' AND m.sequence > a.opening_sequence
                 AND (r.end_sequence IS NULL OR m.sequence <= r.end_sequence)) AS movements_since_opening,
              o.count_id, c.number, c.counted_at, c.total_counted, c.system_cash, o.difference,
              o.difference_reason, o.responsible, ou.username AS opening_user,
              o.movements_since_opening AS opening_movements,
              prev.label AS prev_label, prev.at AS prev_at, prev.counted AS prev_counted, prev.difference AS prev_difference
       FROM cash_bank_day_openings a
       JOIN cash_bank_day_ranges r ON r.id = a.id
       LEFT JOIN cash_opening_counts o ON o.day_opening_id = a.day_opening_id
       LEFT JOIN cash_counts c ON c.id = o.count_id
       LEFT JOIN users ou ON ou.id = o.created_by
       LEFT JOIN LATERAL (
         SELECT x.label, x.counted_at AS at, x.counted, x.difference FROM (${CAJA_COUNTS}) x
         WHERE x.counted_at <= a.opened_at AND x.id IS DISTINCT FROM o.count_id
         ORDER BY x.counted_at DESC, x.sequence DESC LIMIT 1
       ) prev ON TRUE
       WHERE ($1::uuid IS NOT NULL AND a.day_opening_id = $1::uuid) OR ($1::uuid IS NULL AND r.is_current)
       LIMIT 1`,
      [dayOpeningId ?? null],
    );
    if (!row) {
      return null;
    }
    return {
      dayOpeningId: text(row.day_opening_id),
      businessDate: text(row.business_date),
      previousCloseBalance: num(row.previous_close),
      currentTheoretical: num(row.current_theoretical),
      movementsSinceOpening: num(row.movements_since_opening),
      lastCountBefore: row.prev_label
        ? {
            label: text(row.prev_label),
            countedAt: date(row.prev_at)!,
            counted: num(row.prev_counted),
            difference: num(row.prev_difference),
          }
        : null,
      opening: row.count_id
        ? {
            countId: text(row.count_id),
            number: num(row.number),
            countedAt: date(row.counted_at)!,
            counted: num(row.total_counted),
            theoretical: num(row.system_cash),
            difference: num(row.difference),
            reason: str(row.difference_reason),
            responsible: str(row.responsible),
            username: text(row.opening_user),
            movementsSinceOpening: num(row.opening_movements),
          }
        : null,
    };
  }

  async registerOpeningCount(data: RegisterOpeningCountData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_cash_opening_count($1::jsonb, $2, $3, $4, $5, $6) AS id`,
      [
        JSON.stringify(data.details),
        data.observations,
        data.reason,
        data.responsible,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async resolveDifference(data: ResolveDifferenceData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT resolve_cash_count_difference($1, $2, $3, $4, $5, $6, $7) AS id`,
      [
        data.source,
        data.countId,
        data.cause,
        data.explanation,
        data.withAdjustment,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  private async write<T>(sql: string, params: unknown[]): Promise<T> {
    try {
      return await this.dataSource.query<T>(sql, params);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const mapped = cashControlErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
      }
      throw error;
    }
  }
}
