import { MigrationInterface, QueryRunner } from 'typeorm';
import { CuadreCashBreakdownAndCentDenomination1760007600000 } from './1760007600000-CuadreCashBreakdownAndCentDenomination';

/**
 * Cuadre de Agentes → "Cargar último arqueo de Caja" loads the arqueo of the
 * "Segundo corte · final del día" of Control de Efectivo (`cash_cut_counts`
 * of `period_number = 2`) — exactly that one cut's breakdown, never the first
 * cut, never a standalone Arqueo de Caja and never an aggregate of both cuts.
 * The reference day's second cut comes first; otherwise the most recent
 * finished second cut of an earlier day (the UI warns it is from before).
 *
 * A second cut's arqueo is valid only when it is the current count of the cut
 * (`is_current`, a reopened cut leaves the old one `false`) and the cut is
 * FINALIZADO. The cuadre photograph gains origin `CORTE_CAJA` with the exact
 * cut used (`source_cut_count_id`, `source_cut_period_id`, `source_cut_number`)
 * plus the same date/user/total snapshot; `modified_after_load` is derived
 * against that cut's own details. The cut and its arqueo are only read.
 *
 * `close_agent_day_with_cash_breakdown` keeps its signature: with
 * `p_source = 'CORTE_CAJA'` its `p_source_cash_count_id` carries the cut
 * arqueo id. `down` restores the 1760007600000 function and constraint (it
 * refuses if CORTE_CAJA rows exist, which would no longer satisfy it); the new
 * columns and their data are kept.
 */
export class CuadreBreakdownFromLatestCut1760007700000 implements MigrationInterface {
  name = 'CuadreBreakdownFromLatestCut1760007700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE agent_reconciliation_cash_breakdowns
        ADD COLUMN IF NOT EXISTS source_cut_count_id UUID REFERENCES cash_cut_counts(id) ON DELETE RESTRICT,
        ADD COLUMN IF NOT EXISTS source_cut_period_id UUID REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        ADD COLUMN IF NOT EXISTS source_cut_number SMALLINT
    `);
    await queryRunner.query(
      `ALTER TABLE agent_reconciliation_cash_breakdowns DROP CONSTRAINT IF EXISTS "CHK_agent_rec_cash_breakdowns_source"`,
    );
    await queryRunner.query(`
      ALTER TABLE agent_reconciliation_cash_breakdowns ADD CONSTRAINT "CHK_agent_rec_cash_breakdowns_source" CHECK (
        (source = 'MANUAL'
          AND source_cash_count_id IS NULL AND source_cut_count_id IS NULL AND source_cut_period_id IS NULL
          AND source_cut_number IS NULL AND source_count_number IS NULL
          AND source_counted_at IS NULL AND source_business_date IS NULL
          AND source_counted_by IS NULL AND source_total_counted IS NULL
          AND modified_after_load = FALSE)
        OR
        (source = 'ARQUEO_CAJA'
          AND source_cash_count_id IS NOT NULL AND source_count_number IS NOT NULL
          AND source_cut_count_id IS NULL AND source_cut_period_id IS NULL AND source_cut_number IS NULL
          AND source_counted_at IS NOT NULL AND source_business_date IS NOT NULL
          AND source_counted_by IS NOT NULL AND source_total_counted IS NOT NULL)
        OR
        (source = 'CORTE_CAJA'
          AND source_cut_count_id IS NOT NULL AND source_cut_period_id IS NOT NULL
          AND source_cut_number IN (1, 2) AND source_cash_count_id IS NULL AND source_count_number IS NULL
          AND source_counted_at IS NOT NULL AND source_business_date IS NOT NULL
          AND source_counted_by IS NOT NULL AND source_total_counted IS NOT NULL)
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_agent_rec_cash_breakdowns_cut"
        ON agent_reconciliation_cash_breakdowns (source_cut_count_id)
        WHERE source_cut_count_id IS NOT NULL
    `);

    // The single source of "which count does Cuadre de Agentes load": the
    // arqueo of ONE second cut ("final del día") with its own details (no
    // GROUP BY, no SUM across cuts). Order: reference day first, then the most
    // recent operational day, then registration time, then id (deterministic).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_latest_count_candidate(p_reference_date DATE)
      RETURNS TABLE (
        source TEXT, id UUID, number BIGINT, cut_period_id UUID, cut_number SMALLINT,
        business_date DATE, counted_at TIMESTAMPTZ, total_counted NUMERIC, username TEXT, details JSON
      )
      LANGUAGE sql
      STABLE
      AS $fn$
        WITH candidates AS (
          SELECT 'CORTE_CAJA'::TEXT AS source, cc.id, NULL::BIGINT AS number, p.id AS cut_period_id,
                 p.period_number AS cut_number, d.operational_date AS business_date,
                 cc.created_at AS counted_at, cc.total_counted, u.username::TEXT AS username,
                 COALESCE((SELECT json_agg(json_build_object('denomination', x.denomination, 'quantity', x.quantity,
                             'subtotal', x.subtotal) ORDER BY x.denomination DESC)
                           FROM cash_cut_count_details x WHERE x.count_id = cc.id), '[]'::json) AS details
          FROM cash_cut_counts cc
          JOIN cash_cut_periods p ON p.id = cc.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          JOIN users u ON u.id = cc.created_by
          WHERE cc.is_current AND p.status = 'FINALIZADO' AND p.period_number = 2
        )
        SELECT * FROM candidates
        ORDER BY (business_date = p_reference_date) DESC NULLS LAST, business_date DESC,
                 counted_at DESC, id DESC
        LIMIT 1
      $fn$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_agent_day_with_cash_breakdown(
        p_date DATE,
        p_total_cash NUMERIC,
        p_total_banks NUMERIC,
        p_total_assets NUMERIC,
        p_total_accounts_receivable NUMERIC,
        p_result NUMERIC,
        p_user_id UUID,
        p_total_warehouse_cash NUMERIC,
        p_cash_details JSONB,
        p_source VARCHAR,
        p_source_cash_count_id UUID
      ) RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_row RECORD;
        v_total NUMERIC(14,2) := 0;
        v_rows INTEGER := 0;
        v_distinct INTEGER;
        v_count RECORD;
        v_cut RECORD;
        v_modified BOOLEAN := FALSE;
        v_reconciliation_id UUID;
      BEGIN
        IF p_source IS NULL OR p_source NOT IN ('MANUAL', 'ARQUEO_CAJA', 'CORTE_CAJA') THEN
          RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:source';
        END IF;
        IF p_cash_details IS NULL OR jsonb_typeof(p_cash_details) <> 'array' THEN
          RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:details';
        END IF;

        FOR v_row IN
          SELECT * FROM jsonb_to_recordset(p_cash_details) AS x(denomination NUMERIC, quantity NUMERIC)
        LOOP
          IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
             OR v_row.quantity IS NULL OR v_row.quantity < 0
             OR v_row.quantity <> trunc(v_row.quantity) OR v_row.quantity > 1000000 THEN
            RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:denomination';
          END IF;
          v_rows := v_rows + 1;
          v_total := v_total + v_row.denomination * v_row.quantity;
        END LOOP;

        SELECT COUNT(DISTINCT (e->>'denomination')::NUMERIC) INTO v_distinct
        FROM jsonb_array_elements(p_cash_details) e;
        IF v_distinct <> v_rows THEN
          RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:duplicated';
        END IF;

        IF v_total <> p_total_cash THEN
          RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_MISMATCH:%', v_total;
        END IF;

        IF p_source = 'MANUAL' THEN
          IF p_source_cash_count_id IS NOT NULL THEN
            RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:source';
          END IF;
        ELSE
          -- Same roles that may read arqueos and cuts (cash_custody.view = operate roles).
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        END IF;

        IF p_source = 'ARQUEO_CAJA' THEN
          SELECT * INTO v_count FROM cash_counts WHERE id = p_source_cash_count_id;
          IF NOT FOUND OR v_count.status <> 'VIGENTE' THEN
            RAISE EXCEPTION 'CUADRE_SOURCE_COUNT_INVALID:%', p_source_cash_count_id;
          END IF;
          SELECT EXISTS (
            SELECT 1
            FROM (SELECT denomination, quantity FROM cash_count_details
                  WHERE count_id = v_count.id AND quantity > 0) a
            FULL JOIN (SELECT (e->>'denomination')::NUMERIC AS denomination, (e->>'quantity')::INTEGER AS quantity
                       FROM jsonb_array_elements(p_cash_details) e
                       WHERE (e->>'quantity')::INTEGER > 0) b
              ON a.denomination = b.denomination
            WHERE a.quantity IS DISTINCT FROM b.quantity
          ) INTO v_modified;
        ELSIF p_source = 'CORTE_CAJA' THEN
          -- One individual arqueo: the current count of a FINALIZADO second cut (never both cuts added up).
          SELECT cc.id, cc.created_at, cc.created_by, cc.total_counted,
                 p.id AS period_id, p.period_number, d.operational_date
            INTO v_cut
          FROM cash_cut_counts cc
          JOIN cash_cut_periods p ON p.id = cc.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE cc.id = p_source_cash_count_id AND cc.is_current AND p.status = 'FINALIZADO'
            AND p.period_number = 2;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'CUADRE_SOURCE_COUNT_INVALID:%', p_source_cash_count_id;
          END IF;
          SELECT EXISTS (
            SELECT 1
            FROM (SELECT denomination, quantity FROM cash_cut_count_details
                  WHERE count_id = v_cut.id AND quantity > 0) a
            FULL JOIN (SELECT (e->>'denomination')::NUMERIC AS denomination, (e->>'quantity')::INTEGER AS quantity
                       FROM jsonb_array_elements(p_cash_details) e
                       WHERE (e->>'quantity')::INTEGER > 0) b
              ON a.denomination = b.denomination
            WHERE a.quantity IS DISTINCT FROM b.quantity
          ) INTO v_modified;
        END IF;

        v_reconciliation_id := close_agent_day(
          p_date, p_total_cash, p_total_banks, p_total_assets,
          p_total_accounts_receivable, p_result, p_user_id, p_total_warehouse_cash
        );

        IF p_source = 'ARQUEO_CAJA' THEN
          INSERT INTO agent_reconciliation_cash_breakdowns
            (reconciliation_id, source, source_cash_count_id, source_count_number, source_counted_at,
             source_business_date, source_counted_by, source_total_counted, modified_after_load,
             total_cash, created_by)
          VALUES
            (v_reconciliation_id, 'ARQUEO_CAJA', v_count.id, v_count.number, v_count.counted_at,
             v_count.business_date, v_count.created_by, v_count.total_counted, v_modified,
             v_total, p_user_id);
        ELSIF p_source = 'CORTE_CAJA' THEN
          INSERT INTO agent_reconciliation_cash_breakdowns
            (reconciliation_id, source, source_cut_count_id, source_cut_period_id, source_cut_number,
             source_counted_at, source_business_date, source_counted_by, source_total_counted,
             modified_after_load, total_cash, created_by)
          VALUES
            (v_reconciliation_id, 'CORTE_CAJA', v_cut.id, v_cut.period_id, v_cut.period_number,
             v_cut.created_at, v_cut.operational_date, v_cut.created_by, v_cut.total_counted,
             v_modified, v_total, p_user_id);
        ELSE
          INSERT INTO agent_reconciliation_cash_breakdowns
            (reconciliation_id, source, total_cash, created_by)
          VALUES (v_reconciliation_id, 'MANUAL', v_total, p_user_id);
        END IF;

        INSERT INTO agent_reconciliation_cash_details (reconciliation_id, denomination, quantity, subtotal)
        SELECT v_reconciliation_id, x.denomination, x.quantity::INTEGER, x.denomination * x.quantity::INTEGER
        FROM jsonb_to_recordset(p_cash_details) AS x(denomination NUMERIC, quantity NUMERIC);

        RETURN v_reconciliation_id;
      END;
      $fn$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [row] = (await queryRunner.query(
      `SELECT count(*)::int AS n FROM agent_reconciliation_cash_breakdowns WHERE source = 'CORTE_CAJA'`,
    )) as Array<{ n: number }>;
    if (row.n > 0) {
      throw new Error(
        'Cannot revert: cuadres saved from a cut arqueo (CORTE_CAJA) exist and must be kept.',
      );
    }
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_latest_count_candidate(DATE)`,
    );
    await queryRunner.query(
      `ALTER TABLE agent_reconciliation_cash_breakdowns DROP CONSTRAINT IF EXISTS "CHK_agent_rec_cash_breakdowns_source"`,
    );
    await queryRunner.query(`
      ALTER TABLE agent_reconciliation_cash_breakdowns ADD CONSTRAINT "CHK_agent_rec_cash_breakdowns_source" CHECK (
        (source = 'MANUAL'
          AND source_cash_count_id IS NULL AND source_count_number IS NULL
          AND source_counted_at IS NULL AND source_business_date IS NULL
          AND source_counted_by IS NULL AND source_total_counted IS NULL
          AND modified_after_load = FALSE)
        OR
        (source = 'ARQUEO_CAJA'
          AND source_cash_count_id IS NOT NULL AND source_count_number IS NOT NULL
          AND source_counted_at IS NOT NULL AND source_business_date IS NOT NULL
          AND source_counted_by IS NOT NULL AND source_total_counted IS NOT NULL)
      )
    `);
    // Re-creates the 1760007600000 function body (its DDL is idempotent; tables/rows are kept).
    await new CuadreCashBreakdownAndCentDenomination1760007600000().up(
      queryRunner,
    );
  }
}
