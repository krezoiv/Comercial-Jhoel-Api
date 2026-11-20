import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Caja and Bodega as two independent cash locations (owner request,
 * 2026-11-20).
 *
 * 1. Cuts (Control de Efectivo → Cortes del día): finishing a cut now also
 *    photographs the OFFICIAL Bodega balance (`warehouse_cash_balance()`,
 *    read under its own lock, order caja → Bodega like every custody write)
 *    on the count (`cash_cut_counts.warehouse_balance`) and on the period
 *    (`cash_cut_periods.closing_warehouse_balance`). Bodega is never counted
 *    in a cut and never enters the cut's difference (counted caja − system
 *    caja): it is shown next to it as "total bajo resguardo". Reopening a cut
 *    clears it like every other closing figure. Historical cuts keep NULL.
 *
 * 2. Cuadre de Agentes → "Arqueo de Caja": the cuadre's cash photograph
 *    (`agent_reconciliation_cash_breakdowns`) now also stores a PHYSICAL
 *    Bodega count, independent from the caja count:
 *    - `agent_reconciliation_warehouse_details` (one row per denomination);
 *    - theoretical caja (`cash_balance()`) and Bodega
 *      (`warehouse_cash_balance()`) at save time, the counted Bodega, each
 *      location's own difference and the consolidated one, plus
 *      observations. Individual differences are always stored, so a caja
 *      shortage hidden by a Bodega surplus stays visible.
 *    The counted Bodega is what enters the cuadre result (owner decision:
 *    the count is mandatory and the result uses Caja contada + Bodega
 *    contada); `p_total_warehouse_cash` must equal the Bodega breakdown.
 *    Nothing here writes a Kardex or adjusts a balance.
 *
 * Historical rows are never touched: the new columns are NULL on them (no
 * Bodega count), the new details table is empty for them, and calls without
 * `p_warehouse_details` keep the previous behaviour.
 */

async function liveDefinition(
  queryRunner: QueryRunner,
  fn: string,
): Promise<string> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1) {
    throw new Error(`${fn}: expected exactly one definition`);
  }
  return rows[0].def;
}

function replaceOnce(
  def: string,
  fn: string,
  from: string,
  to: string,
): string {
  if (def.split(from).length !== 2) {
    throw new Error(`${fn}: anchor not found exactly once`);
  }
  return def.replace(from, to);
}

async function patchFunction(
  queryRunner: QueryRunner,
  fn: string,
  patches: Array<[string, string]>,
): Promise<void> {
  let def = await liveDefinition(queryRunner, fn);
  for (const [from, to] of patches) {
    def = replaceOnce(def, fn, from, to);
  }
  await queryRunner.query(def);
}

/** `finish_cash_cut_period`: snapshot of the official Bodega balance. */
const FINISH_PATCHES: Array<[string, string]> = [
  [
    'v_bank_system NUMERIC(14,2);',
    'v_bank_system NUMERIC(14,2);\n        v_warehouse NUMERIC(14,2);',
  ],
  [
    "PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));",
    "PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));\n" +
      '        -- Bodega is read under its own lock too (order caja → Bodega, as every custody write).\n' +
      "        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));",
  ],
  [
    'v_system := cash_balance();',
    'v_system := cash_balance();\n        v_warehouse := warehouse_cash_balance();',
  ],
  [
    'difference, observations, created_by)',
    'difference, observations, created_by, warehouse_balance)',
  ],
  [
    "NULLIF(trim(p_cash_observations), ''), p_user_id)",
    "NULLIF(trim(p_cash_observations), ''), p_user_id, v_warehouse)",
  ],
  [
    'closing_physical_cash = v_counted, cash_difference = v_counted - v_system,',
    'closing_physical_cash = v_counted, cash_difference = v_counted - v_system,\n' +
      '            closing_warehouse_balance = v_warehouse,',
  ],
  [
    "'closingPhysicalCash', v_counted, 'cashDifference', v_counted - v_system,",
    "'closingPhysicalCash', v_counted, 'cashDifference', v_counted - v_system,\n" +
      "          'closingWarehouseBalance', v_warehouse, 'closingCustodyTotal', v_counted + v_warehouse,",
  ],
];

/** `reopen_cash_cut_period`: the Bodega snapshot is a closing figure like the others. */
const REOPEN_PATCHES: Array<[string, string]> = [
  [
    'closing_system_cash = NULL, closing_physical_cash = NULL, cash_difference = NULL,',
    'closing_system_cash = NULL, closing_physical_cash = NULL, cash_difference = NULL,\n' +
      '            closing_warehouse_balance = NULL,',
  ],
];

function reversed(patches: Array<[string, string]>): Array<[string, string]> {
  return [...patches].reverse().map(([from, to]) => [to, from]);
}

/** Previous signature (migration 1760008700000). */
const OLD_BREAKDOWN_SIGNATURE =
  'close_agent_day_with_cash_breakdown(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, JSONB, VARCHAR, UUID, NUMERIC)';
const NEW_BREAKDOWN_SIGNATURE =
  'close_agent_day_with_cash_breakdown(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, JSONB, VARCHAR, UUID, NUMERIC, JSONB, VARCHAR)';

/**
 * Cuadre close + cash photograph. Same validations and source handling as
 * before; new: the optional physical Bodega count (`p_warehouse_details`),
 * the theoretical balances of both locations and every difference.
 */
const NEW_BREAKDOWN_FUNCTION = `
  CREATE FUNCTION close_agent_day_with_cash_breakdown(
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
    p_source_cash_count_id UUID,
    p_total_school_list_pending NUMERIC DEFAULT 0,
    p_warehouse_details JSONB DEFAULT NULL,
    p_observations VARCHAR DEFAULT NULL
  ) RETURNS UUID
  LANGUAGE plpgsql
  AS $function$
  DECLARE
    v_row RECORD;
    v_total NUMERIC(14,2) := 0;
    v_rows INTEGER := 0;
    v_distinct INTEGER;
    v_count RECORD;
    v_cut RECORD;
    v_modified BOOLEAN := FALSE;
    v_reconciliation_id UUID;
    -- Source photograph (scalars so one INSERT serves every source).
    v_src_count_id UUID;
    v_src_count_number BIGINT;
    v_src_cut_count_id UUID;
    v_src_cut_period_id UUID;
    v_src_cut_number SMALLINT;
    v_src_counted_at TIMESTAMPTZ;
    v_src_business_date DATE;
    v_src_counted_by UUID;
    v_src_total NUMERIC(14,2);
    -- Physical Bodega count and both theoretical balances.
    v_wh_total NUMERIC(14,2) := 0;
    v_wh_rows INTEGER := 0;
    v_cash_theoretical NUMERIC(14,2);
    v_wh_theoretical NUMERIC(14,2);
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

    -- Physical Bodega count: independent from the caja count, same rules.
    IF p_warehouse_details IS NOT NULL THEN
      IF jsonb_typeof(p_warehouse_details) <> 'array' THEN
        RAISE EXCEPTION 'CUADRE_WAREHOUSE_BREAKDOWN_INVALID:details';
      END IF;
      FOR v_row IN
        SELECT * FROM jsonb_to_recordset(p_warehouse_details) AS x(denomination NUMERIC, quantity NUMERIC)
      LOOP
        IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
           OR v_row.quantity IS NULL OR v_row.quantity < 0
           OR v_row.quantity <> trunc(v_row.quantity) OR v_row.quantity > 1000000 THEN
          RAISE EXCEPTION 'CUADRE_WAREHOUSE_BREAKDOWN_INVALID:denomination';
        END IF;
        v_wh_rows := v_wh_rows + 1;
        v_wh_total := v_wh_total + v_row.denomination * v_row.quantity;
      END LOOP;

      SELECT COUNT(DISTINCT (e->>'denomination')::NUMERIC) INTO v_distinct
      FROM jsonb_array_elements(p_warehouse_details) e;
      IF v_distinct <> v_wh_rows THEN
        RAISE EXCEPTION 'CUADRE_WAREHOUSE_BREAKDOWN_INVALID:duplicated';
      END IF;

      -- The counted Bodega is the Bodega that enters the result.
      IF v_wh_total <> p_total_warehouse_cash THEN
        RAISE EXCEPTION 'CUADRE_WAREHOUSE_BREAKDOWN_MISMATCH:%', v_wh_total;
      END IF;

      -- Official balances of both locations at save time (read, never adjusted).
      v_cash_theoretical := cash_balance();
      v_wh_theoretical := warehouse_cash_balance();
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
      v_src_count_id := v_count.id;
      v_src_count_number := v_count.number;
      v_src_counted_at := v_count.counted_at;
      v_src_business_date := v_count.business_date;
      v_src_counted_by := v_count.created_by;
      v_src_total := v_count.total_counted;
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
      v_src_cut_count_id := v_cut.id;
      v_src_cut_period_id := v_cut.period_id;
      v_src_cut_number := v_cut.period_number;
      v_src_counted_at := v_cut.created_at;
      v_src_business_date := v_cut.operational_date;
      v_src_counted_by := v_cut.created_by;
      v_src_total := v_cut.total_counted;
    END IF;

    v_reconciliation_id := close_agent_day(
      p_date, p_total_cash, p_total_banks, p_total_assets,
      p_total_accounts_receivable, p_result, p_user_id, p_total_warehouse_cash, p_total_school_list_pending
    );

    INSERT INTO agent_reconciliation_cash_breakdowns
      (reconciliation_id, source, source_cash_count_id, source_count_number,
       source_cut_count_id, source_cut_period_id, source_cut_number,
       source_counted_at, source_business_date, source_counted_by, source_total_counted,
       modified_after_load, total_cash, created_by,
       cash_theoretical, cash_difference, warehouse_theoretical, warehouse_counted,
       warehouse_difference, consolidated_difference, observations)
    VALUES
      (v_reconciliation_id, p_source, v_src_count_id, v_src_count_number,
       v_src_cut_count_id, v_src_cut_period_id, v_src_cut_number,
       v_src_counted_at, v_src_business_date, v_src_counted_by, v_src_total,
       v_modified, v_total, p_user_id,
       v_cash_theoretical,
       CASE WHEN p_warehouse_details IS NOT NULL THEN v_total - v_cash_theoretical END,
       v_wh_theoretical,
       CASE WHEN p_warehouse_details IS NOT NULL THEN v_wh_total END,
       CASE WHEN p_warehouse_details IS NOT NULL THEN v_wh_total - v_wh_theoretical END,
       CASE WHEN p_warehouse_details IS NOT NULL
            THEN (v_total - v_cash_theoretical) + (v_wh_total - v_wh_theoretical) END,
       NULLIF(left(trim(p_observations), 500), ''));

    INSERT INTO agent_reconciliation_cash_details (reconciliation_id, denomination, quantity, subtotal)
    SELECT v_reconciliation_id, x.denomination, x.quantity::INTEGER, x.denomination * x.quantity::INTEGER
    FROM jsonb_to_recordset(p_cash_details) AS x(denomination NUMERIC, quantity NUMERIC);

    IF p_warehouse_details IS NOT NULL THEN
      INSERT INTO agent_reconciliation_warehouse_details (reconciliation_id, denomination, quantity, subtotal)
      SELECT v_reconciliation_id, x.denomination, x.quantity::INTEGER, x.denomination * x.quantity::INTEGER
      FROM jsonb_to_recordset(p_warehouse_details) AS x(denomination NUMERIC, quantity NUMERIC);
    END IF;

    RETURN v_reconciliation_id;
  END;
  $function$
`;

/** Definition before this migration (restored by `down`). */
const OLD_BREAKDOWN_FUNCTION = `
  CREATE FUNCTION close_agent_day_with_cash_breakdown(p_date date, p_total_cash numeric, p_total_banks numeric, p_total_assets numeric, p_total_accounts_receivable numeric, p_result numeric, p_user_id uuid, p_total_warehouse_cash numeric, p_cash_details jsonb, p_source character varying, p_source_cash_count_id uuid, p_total_school_list_pending numeric DEFAULT 0)
   RETURNS uuid
   LANGUAGE plpgsql
  AS $function$
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
          p_total_accounts_receivable, p_result, p_user_id, p_total_warehouse_cash, p_total_school_list_pending
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
      $function$
`;

export class CuadreWarehouseCountAndCutCustody1760008800000 implements MigrationInterface {
  name = 'CuadreWarehouseCountAndCutCustody1760008800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. Cuts: official Bodega balance photographed at finish ──────────
    await queryRunner.query(`
      ALTER TABLE cash_cut_periods
        ADD COLUMN closing_warehouse_balance NUMERIC(14,2),
        ADD CONSTRAINT "CHK_cash_cut_periods_warehouse"
          CHECK (closing_warehouse_balance IS NULL OR closing_warehouse_balance >= 0)
    `);
    await queryRunner.query(`
      ALTER TABLE cash_cut_counts
        ADD COLUMN warehouse_balance NUMERIC(14,2),
        ADD CONSTRAINT "CHK_cash_cut_counts_warehouse"
          CHECK (warehouse_balance IS NULL OR warehouse_balance >= 0)
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN cash_cut_periods.closing_warehouse_balance IS
        'Official Bodega balance when the cut was finished (never counted, never in the cut difference). NULL = cut finished before 1760008800000 or not finished.'
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN cash_cut_counts.warehouse_balance IS
        'Official Bodega balance photographed with this cut arqueo. NULL = arqueo before 1760008800000.'
    `);
    await patchFunction(queryRunner, 'finish_cash_cut_period', FINISH_PATCHES);
    await patchFunction(queryRunner, 'reopen_cash_cut_period', REOPEN_PATCHES);

    // ── 2. Cuadre de Agentes: physical Bodega count in the photograph ────
    await queryRunner.query(`
      ALTER TABLE agent_reconciliation_cash_breakdowns
        ADD COLUMN cash_theoretical NUMERIC(14,2),
        ADD COLUMN cash_difference NUMERIC(14,2),
        ADD COLUMN warehouse_theoretical NUMERIC(14,2),
        ADD COLUMN warehouse_counted NUMERIC(14,2),
        ADD COLUMN warehouse_difference NUMERIC(14,2),
        ADD COLUMN consolidated_difference NUMERIC(14,2),
        ADD COLUMN observations VARCHAR(500),
        ADD CONSTRAINT "CHK_agent_rec_cash_breakdowns_custody" CHECK (
          (cash_theoretical IS NULL AND cash_difference IS NULL AND warehouse_theoretical IS NULL
           AND warehouse_counted IS NULL AND warehouse_difference IS NULL AND consolidated_difference IS NULL)
          OR
          (cash_theoretical IS NOT NULL AND warehouse_theoretical IS NOT NULL
           AND warehouse_counted IS NOT NULL AND warehouse_counted >= 0
           AND cash_difference = total_cash - cash_theoretical
           AND warehouse_difference = warehouse_counted - warehouse_theoretical
           AND consolidated_difference = cash_difference + warehouse_difference)
        )
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN agent_reconciliation_cash_breakdowns.warehouse_counted IS
        'Physical Bodega count of the cuadre (Arqueo de Caja). NULL = cuadre saved before 1760008800000 (Bodega was not counted).'
    `);
    await queryRunner.query(`
      CREATE TABLE agent_reconciliation_warehouse_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reconciliation_id UUID NOT NULL
          REFERENCES agent_reconciliation_cash_breakdowns(reconciliation_id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_agent_rec_warehouse_details" UNIQUE (reconciliation_id, denomination),
        CONSTRAINT "CHK_agent_rec_warehouse_details_quantity" CHECK (quantity >= 0),
        CONSTRAINT "CHK_agent_rec_warehouse_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    // A photograph like the caja details: no UPDATE, no DELETE.
    await queryRunner.query(`
      CREATE TRIGGER trg_agent_reconciliation_warehouse_details_guard
        BEFORE UPDATE OR DELETE ON agent_reconciliation_warehouse_details
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);

    await queryRunner.query(`DROP FUNCTION ${OLD_BREAKDOWN_SIGNATURE}`);
    await queryRunner.query(NEW_BREAKDOWN_FUNCTION);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION ${NEW_BREAKDOWN_SIGNATURE}`);
    await queryRunner.query(OLD_BREAKDOWN_FUNCTION);
    await queryRunner.query(
      'DROP TABLE IF EXISTS agent_reconciliation_warehouse_details',
    );
    await queryRunner.query(`
      ALTER TABLE agent_reconciliation_cash_breakdowns
        DROP CONSTRAINT IF EXISTS "CHK_agent_rec_cash_breakdowns_custody",
        DROP COLUMN IF EXISTS observations,
        DROP COLUMN IF EXISTS consolidated_difference,
        DROP COLUMN IF EXISTS warehouse_difference,
        DROP COLUMN IF EXISTS warehouse_counted,
        DROP COLUMN IF EXISTS warehouse_theoretical,
        DROP COLUMN IF EXISTS cash_difference,
        DROP COLUMN IF EXISTS cash_theoretical
    `);

    await patchFunction(
      queryRunner,
      'reopen_cash_cut_period',
      reversed(REOPEN_PATCHES),
    );
    await patchFunction(
      queryRunner,
      'finish_cash_cut_period',
      reversed(FINISH_PATCHES),
    );
    await queryRunner.query(`
      ALTER TABLE cash_cut_counts
        DROP CONSTRAINT IF EXISTS "CHK_cash_cut_counts_warehouse",
        DROP COLUMN IF EXISTS warehouse_balance
    `);
    await queryRunner.query(`
      ALTER TABLE cash_cut_periods
        DROP CONSTRAINT IF EXISTS "CHK_cash_cut_periods_warehouse",
        DROP COLUMN IF EXISTS closing_warehouse_balance
    `);
  }
}
