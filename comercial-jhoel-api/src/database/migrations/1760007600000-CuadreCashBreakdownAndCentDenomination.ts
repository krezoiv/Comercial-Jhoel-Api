import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 1. Q0.01 ("un centavo") becomes a valid denomination everywhere the cash is
 *    counted: `cash_valid_denomination` (Arqueo de Caja, Bodega deliveries and
 *    withdrawals, cash bank deposits, cut counts) and
 *    `guayacan_valid_denomination` (Caja Guayacán). Transaccionar already
 *    accepts any positive denomination in SQL. Historical rows are untouched:
 *    a count saved without Q0.01 simply has no row for it (= 0).
 *
 * 2. Cuadre de Agentes keeps an independent photograph of the cash breakdown
 *    it was saved with (`agent_reconciliation_cash_breakdowns` + details):
 *    origin MANUAL or ARQUEO_CAJA, the source Arqueo de Caja (id, number,
 *    date/time, bank day, user, counted total) and whether the loaded
 *    breakdown was modified before saving. The source count is only read —
 *    `cash_counts` is never written here.
 *
 *    `close_agent_day_with_cash_breakdown` validates the breakdown
 *    (denominations, whole quantities ≥ 0, no duplicates, total = total cash),
 *    the source count (exists, VIGENTE, role allowed to read counts), derives
 *    "modified" itself by comparing against the source details, and then calls
 *    the unchanged `close_agent_day` — all in one transaction. The existing
 *    `close_agent_day` signature is kept for callers that send no breakdown.
 *
 * `down` restores both denomination lists and drops the new function; the new
 * tables and their rows are kept (no historical data is deleted).
 */
export class CuadreCashBreakdownAndCentDenomination1760007600000 implements MigrationInterface {
  name = 'CuadreCashBreakdownAndCentDenomination1760007600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.setDenominations(queryRunner, [...DENOMINATIONS, '0.01']);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS agent_reconciliation_cash_breakdowns (
        reconciliation_id UUID PRIMARY KEY REFERENCES agent_reconciliations(id) ON DELETE RESTRICT,
        source VARCHAR(12) NOT NULL,
        source_cash_count_id UUID REFERENCES cash_counts(id) ON DELETE RESTRICT,
        source_count_number BIGINT,
        source_counted_at TIMESTAMPTZ,
        source_business_date DATE,
        source_counted_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        source_total_counted NUMERIC(14,2),
        modified_after_load BOOLEAN NOT NULL DEFAULT FALSE,
        total_cash NUMERIC(14,2) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_agent_rec_cash_breakdowns_total" CHECK (total_cash >= 0),
        CONSTRAINT "CHK_agent_rec_cash_breakdowns_source" CHECK (
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
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_agent_rec_cash_breakdowns_source"
        ON agent_reconciliation_cash_breakdowns (source_cash_count_id)
        WHERE source_cash_count_id IS NOT NULL
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS agent_reconciliation_cash_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reconciliation_id UUID NOT NULL
          REFERENCES agent_reconciliation_cash_breakdowns(reconciliation_id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_agent_rec_cash_details" UNIQUE (reconciliation_id, denomination),
        CONSTRAINT "CHK_agent_rec_cash_details_quantity" CHECK (quantity >= 0),
        CONSTRAINT "CHK_agent_rec_cash_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);

    // Both tables are photographs: no UPDATE, no DELETE (same guard as the arqueos).
    for (const table of [
      'agent_reconciliation_cash_breakdowns',
      'agent_reconciliation_cash_details',
    ]) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_${table}_guard ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_${table}_guard
          BEFORE UPDATE OR DELETE ON ${table}
          FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
      `);
    }

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
        v_modified BOOLEAN := FALSE;
        v_reconciliation_id UUID;
      BEGIN
        IF p_source IS NULL OR p_source NOT IN ('MANUAL', 'ARQUEO_CAJA') THEN
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

        IF p_source = 'ARQUEO_CAJA' THEN
          -- Same roles that may read the arqueos (cash_custody.view = operate roles).
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
          SELECT * INTO v_count FROM cash_counts WHERE id = p_source_cash_count_id;
          IF NOT FOUND OR v_count.status <> 'VIGENTE' THEN
            RAISE EXCEPTION 'CUADRE_SOURCE_COUNT_INVALID:%', p_source_cash_count_id;
          END IF;
          -- Derived here, never trusted from the client: any non-zero quantity that differs.
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
        ELSIF p_source_cash_count_id IS NOT NULL THEN
          RAISE EXCEPTION 'CUADRE_CASH_BREAKDOWN_INVALID:source';
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
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS close_agent_day_with_cash_breakdown(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, JSONB, VARCHAR, UUID)`,
    );
    await this.setDenominations(queryRunner, DENOMINATIONS);
    // Tables, triggers and rows are kept: they hold historical cuadres.
  }

  private async setDenominations(
    queryRunner: QueryRunner,
    values: string[],
  ): Promise<void> {
    for (const name of [
      'cash_valid_denomination',
      'guayacan_valid_denomination',
    ]) {
      await queryRunner.query(`
        CREATE OR REPLACE FUNCTION ${name}(p_value NUMERIC)
        RETURNS BOOLEAN
        LANGUAGE sql
        IMMUTABLE
        AS $fn$ SELECT p_value IN (${values.join(', ')}) $fn$
      `);
    }
  }
}

const DENOMINATIONS = [
  '200',
  '100',
  '50',
  '20',
  '10',
  '5',
  '1',
  '0.50',
  '0.25',
  '0.10',
  '0.05',
];
