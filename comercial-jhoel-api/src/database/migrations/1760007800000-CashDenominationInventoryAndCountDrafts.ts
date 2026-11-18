import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Control de Efectivo — inventario por denominación (caja y Bodega), desglose
 * obligatorio en los traslados caja ↔ Bodega y borradores del Arqueo de Caja.
 *
 * Inventory is DERIVED, never stored as mutable stock (no drift between
 * movements and stock):
 *  - CAJA: anchored on the latest valid physical count of the caja — a
 *    VIGENTE standalone Arqueo de Caja (`cash_counts`, at `last_cash_sequence`)
 *    or the current count of a FINALIZADO cut (`cash_cut_counts`, at the cut's
 *    `closing_sequence`), whichever is later in the Kardex — plus every later
 *    caja movement that carries denominations (`cash_movement_details`, or the
 *    Bodega-side details of a withdrawal to caja). Reversals (ANULACION) apply
 *    the original's details with their own direction.
 *  - BODEGA: anchored on the latest `warehouse_cash_counts` (new: an audited
 *    per-denomination count of Bodega that must equal its balance) plus every
 *    later Bodega movement with denominations.
 *  - Whatever moved without denominations (Transaccionar, CxC, Activos, bank
 *    withdrawals, manual movements, the Bodega initial balance) is reported as
 *    "sin desglosar" = balance − Σ(quantity × denomination).
 *
 * Writes are unchanged except two patches of the live functions (verified
 * anchors): `register_cash_warehouse_transfer` and
 * `register_warehouse_withdrawal` now REQUIRE the breakdown (the admin
 * "sin desglose" path is removed; historical rows stay as they are) and check,
 * under their existing locks, that every denomination requested is available
 * at the origin (`cash_assert_denominations_available`).
 *
 * `cash_count_drafts`: the in-progress Arqueo de Caja of a user for a bank day
 * (one row per user × day opening), so typed quantities survive navigation,
 * reloads and logout. Drafts are not financial records: they are upserted and
 * deleted when the count is confirmed or explicitly reset.
 *
 * `down` restores both functions and drops the new functions; tables and rows
 * are kept (no data is deleted).
 */
export class CashDenominationInventoryAndCountDrafts1760007800000 implements MigrationInterface {
  name = 'CashDenominationInventoryAndCountDrafts1760007800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Bodega per-denomination counts (immutable) ─────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS warehouse_cash_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number BIGSERIAL NOT NULL,
        counted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        business_date DATE NOT NULL,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        warehouse_sequence BIGINT NOT NULL,
        warehouse_balance NUMERIC(14,2) NOT NULL,
        total_counted NUMERIC(14,2) NOT NULL,
        observations VARCHAR(500),
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_warehouse_cash_counts_number" UNIQUE (number),
        CONSTRAINT "UQ_warehouse_cash_counts_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_warehouse_cash_counts_total" CHECK (total_counted = warehouse_balance AND total_counted >= 0)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS warehouse_cash_count_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_id UUID NOT NULL REFERENCES warehouse_cash_counts(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_warehouse_cash_count_details" UNIQUE (count_id, denomination),
        CONSTRAINT "CHK_warehouse_cash_count_details_quantity" CHECK (quantity >= 0),
        CONSTRAINT "CHK_warehouse_cash_count_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    for (const table of [
      'warehouse_cash_counts',
      'warehouse_cash_count_details',
    ]) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_${table}_guard ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_${table}_guard BEFORE UPDATE OR DELETE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
      `);
    }

    // ── Arqueo de Caja drafts (mutable, one per user × bank day) ───────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_count_drafts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        business_date DATE NOT NULL,
        payload JSONB NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_count_drafts_user_day" UNIQUE (user_id, day_opening_id),
        CONSTRAINT "CHK_cash_count_drafts_payload" CHECK (jsonb_typeof(payload) = 'object')
      )
    `);

    // ── Inventory (derived) ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_location_anchor(p_location TEXT)
      RETURNS TABLE (kind TEXT, id UUID, number BIGINT, counted_at TIMESTAMPTZ, anchor_sequence BIGINT, total NUMERIC, counted_by UUID)
      LANGUAGE sql STABLE
      AS $fn$
        SELECT * FROM (
          SELECT 'ARQUEO_CAJA'::TEXT, c.id, c.number, c.counted_at, c.last_cash_sequence, c.total_counted, c.created_by
          FROM cash_counts c WHERE p_location = 'CAJA' AND c.status = 'VIGENTE'
          UNION ALL
          SELECT 'CORTE_CAJA'::TEXT, cc.id, p.period_number::BIGINT, cc.created_at, p.closing_sequence, cc.total_counted, cc.created_by
          FROM cash_cut_counts cc JOIN cash_cut_periods p ON p.id = cc.cut_period_id
          WHERE p_location = 'CAJA' AND cc.is_current AND p.status = 'FINALIZADO'
          UNION ALL
          SELECT 'CONTEO_BODEGA'::TEXT, w.id, w.number, w.counted_at, w.warehouse_sequence, w.total_counted, w.created_by
          FROM warehouse_cash_counts w WHERE p_location = 'BODEGA'
        ) a (kind, id, number, counted_at, anchor_sequence, total, counted_by)
        ORDER BY anchor_sequence DESC, counted_at DESC, id DESC
        LIMIT 1
      $fn$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_location_inventory(p_location TEXT)
      RETURNS TABLE (denomination NUMERIC, quantity BIGINT)
      LANGUAGE plpgsql STABLE
      AS $fn$
      DECLARE
        a RECORD;
      BEGIN
        IF p_location NOT IN ('CAJA', 'BODEGA') THEN
          RAISE EXCEPTION 'CASH_INVALID_LOCATION:%', p_location;
        END IF;
        SELECT * INTO a FROM cash_location_anchor(p_location);
        IF p_location = 'CAJA' THEN
          RETURN QUERY
          WITH den AS (SELECT unnest(ARRAY[${DENOMS}]::NUMERIC[]) AS d),
          base AS (
            SELECT x.denomination AS d, x.quantity::BIGINT AS q FROM cash_count_details x
            WHERE a.kind = 'ARQUEO_CAJA' AND x.count_id = a.id
            UNION ALL
            SELECT x.denomination, x.quantity::BIGINT FROM cash_cut_count_details x
            WHERE a.kind = 'CORTE_CAJA' AND x.count_id = a.id
          ),
          mv AS (
            SELECT m.direction, COALESCE(m.reversal_of_id, m.id) AS src FROM cash_movements m
            WHERE a.id IS NOT NULL AND m.sequence > a.anchor_sequence AND m.direction IN ('IN', 'OUT')
          ),
          det AS (
            SELECT mv.direction, d.denomination, d.quantity FROM mv JOIN cash_movement_details d ON d.movement_id = mv.src
            UNION ALL
            SELECT mv.direction, wd.denomination, wd.quantity FROM mv
            JOIN warehouse_cash_withdrawals w ON w.cash_movement_id = mv.src
            JOIN warehouse_cash_movement_details wd ON wd.movement_id = w.warehouse_movement_id
            WHERE NOT EXISTS (SELECT 1 FROM cash_movement_details z WHERE z.movement_id = mv.src)
          ),
          agg AS (
            SELECT t.d, sum(t.q) AS q FROM (
              SELECT b.d, b.q FROM base b
              UNION ALL
              SELECT det.denomination, CASE det.direction WHEN 'IN' THEN det.quantity ELSE -det.quantity END::BIGINT FROM det
            ) t GROUP BY t.d
          )
          SELECT den.d, COALESCE(agg.q, 0)::BIGINT FROM den LEFT JOIN agg ON agg.d = den.d ORDER BY den.d DESC;
        ELSE
          RETURN QUERY
          WITH den AS (SELECT unnest(ARRAY[${DENOMS}]::NUMERIC[]) AS d),
          base AS (
            SELECT x.denomination AS d, x.quantity::BIGINT AS q FROM warehouse_cash_count_details x
            WHERE x.count_id = a.id
          ),
          mv AS (
            SELECT m.direction, COALESCE(m.reversal_of_id, m.id) AS src FROM warehouse_cash_movements m
            WHERE a.id IS NOT NULL AND m.sequence > a.anchor_sequence AND m.direction IN ('IN', 'OUT')
          ),
          det AS (
            SELECT mv.direction, d.denomination, d.quantity FROM mv JOIN warehouse_cash_movement_details d ON d.movement_id = mv.src
            UNION ALL
            SELECT mv.direction, cd.denomination, cd.quantity FROM mv
            JOIN cash_warehouse_transfers t ON t.warehouse_movement_id = mv.src
            JOIN cash_movement_details cd ON cd.movement_id = t.cash_movement_id
            WHERE NOT EXISTS (SELECT 1 FROM warehouse_cash_movement_details z WHERE z.movement_id = mv.src)
          ),
          agg AS (
            SELECT t.d, sum(t.q) AS q FROM (
              SELECT b.d, b.q FROM base b
              UNION ALL
              SELECT det.denomination, CASE det.direction WHEN 'IN' THEN det.quantity ELSE -det.quantity END::BIGINT FROM det
            ) t GROUP BY t.d
          )
          SELECT den.d, COALESCE(agg.q, 0)::BIGINT FROM den LEFT JOIN agg ON agg.d = den.d ORDER BY den.d DESC;
        END IF;
      END;
      $fn$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_location_inventory_summary(p_location TEXT)
      RETURNS TABLE (
        has_anchor BOOLEAN, anchor_kind TEXT, anchor_id UUID, anchor_number BIGINT, anchor_at TIMESTAMPTZ,
        anchor_sequence BIGINT, anchor_by UUID, balance NUMERIC, known_total NUMERIC, unbroken NUMERIC
      )
      LANGUAGE plpgsql STABLE
      AS $fn$
      DECLARE
        a RECORD;
        v_balance NUMERIC(14,2);
        v_known NUMERIC(14,2);
      BEGIN
        SELECT * INTO a FROM cash_location_anchor(p_location);
        v_balance := CASE p_location WHEN 'CAJA' THEN cash_balance() ELSE warehouse_cash_balance() END;
        SELECT COALESCE(sum(i.denomination * i.quantity), 0) INTO v_known FROM cash_location_inventory(p_location) i;
        RETURN QUERY SELECT a.id IS NOT NULL, a.kind, a.id, a.number, a.counted_at, a.anchor_sequence, a.counted_by,
          v_balance, v_known, v_balance - v_known;
      END;
      $fn$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_assert_denominations_available(p_location TEXT, p_details JSONB)
      RETURNS VOID
      LANGUAGE plpgsql STABLE
      AS $fn$
      DECLARE
        v_row RECORD;
        v_available BIGINT;
      BEGIN
        -- Called by the transfer writers AFTER taking the caja / Bodega locks,
        -- so the inventory read here cannot change before the movement commits.
        IF NOT EXISTS (SELECT 1 FROM cash_location_anchor(p_location)) THEN
          RAISE EXCEPTION '%', CASE p_location WHEN 'CAJA' THEN 'CASH_COUNT_REQUIRED:' ELSE 'WAREHOUSE_COUNT_REQUIRED:' END;
        END IF;
        FOR v_row IN
          SELECT (d->>'denomination')::NUMERIC AS denomination, (d->>'quantity')::BIGINT AS quantity
          FROM jsonb_array_elements(p_details) d
        LOOP
          SELECT i.quantity INTO v_available FROM cash_location_inventory(p_location) i WHERE i.denomination = v_row.denomination;
          IF COALESCE(v_available, 0) < v_row.quantity THEN
            RAISE EXCEPTION '%:%:%:%',
              CASE p_location WHEN 'CAJA' THEN 'CASH_DENOMINATION_NOT_AVAILABLE' ELSE 'WAREHOUSE_DENOMINATION_NOT_AVAILABLE' END,
              v_row.denomination, GREATEST(COALESCE(v_available, 0), 0), v_row.quantity;
          END IF;
        END LOOP;
      END;
      $fn$
    `);

    // ── Bodega count writer ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_warehouse_cash_count(
        p_details JSONB, p_observations VARCHAR, p_user_id UUID, p_idempotency_key VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_day RECORD;
        v_row RECORD;
        v_total NUMERIC(14,2) := 0;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_balance NUMERIC(14,2);
        v_sequence BIGINT;
      BEGIN
        -- Sets the reference of the Bodega inventory: administrators only.
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_count:' || p_idempotency_key));
        SELECT id INTO v_existing FROM warehouse_cash_counts WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        SELECT * INTO v_day FROM cash_current_bank_day();
        IF v_day.day_opening_id IS NULL OR NOT v_day.is_open THEN
          RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
        END IF;
        IF p_details IS NULL OR jsonb_typeof(p_details) <> 'array' OR jsonb_array_length(p_details) = 0 THEN
          RAISE EXCEPTION 'CASH_CUSTODY_BREAKDOWN_REQUIRED';
        END IF;
        FOR v_row IN
          SELECT (d->>'denomination')::NUMERIC AS denomination, (d->>'quantity')::NUMERIC AS quantity
          FROM jsonb_array_elements(p_details) d
        LOOP
          IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
             OR v_row.quantity IS NULL OR v_row.quantity < 0 OR v_row.quantity <> trunc(v_row.quantity)
             OR v_row.denomination = ANY (v_seen) THEN
            RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
          END IF;
          v_seen := v_seen || v_row.denomination;
          v_total := v_total + v_row.denomination * v_row.quantity;
        END LOOP;

        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        v_balance := warehouse_cash_balance();
        IF v_total <> v_balance THEN
          RAISE EXCEPTION 'WAREHOUSE_COUNT_MISMATCH:%:%', v_total, v_balance;
        END IF;
        SELECT COALESCE(max(sequence), 0) INTO v_sequence FROM warehouse_cash_movements;

        INSERT INTO warehouse_cash_counts (
          id, business_date, day_opening_id, warehouse_sequence, warehouse_balance, total_counted,
          observations, idempotency_key, created_by
        ) VALUES (
          v_id, v_day.business_date, v_day.day_opening_id, v_sequence, v_balance, v_total,
          NULLIF(btrim(p_observations), ''), p_idempotency_key, p_user_id
        );
        INSERT INTO warehouse_cash_count_details (count_id, denomination, quantity, subtotal)
        SELECT v_id, (d->>'denomination')::NUMERIC, (d->>'quantity')::INT,
               (d->>'denomination')::NUMERIC * (d->>'quantity')::INT
        FROM jsonb_array_elements(p_details) d;
        RETURN v_id;
      END;
      $fn$
    `);

    // ── Patches: breakdown mandatory + per-denomination availability ───────
    await patchFunction(
      queryRunner,
      'register_cash_warehouse_transfer',
      TRANSFER_NO_BREAKDOWN,
      TRANSFER_REQUIRE_BREAKDOWN,
    );
    await patchFunction(
      queryRunner,
      'register_cash_warehouse_transfer',
      TRANSFER_BALANCE,
      TRANSFER_BALANCE + TRANSFER_AVAILABLE,
    );
    await patchFunction(
      queryRunner,
      'register_warehouse_withdrawal',
      WITHDRAWAL_NO_BREAKDOWN,
      WITHDRAWAL_REQUIRE_BREAKDOWN,
    );
    await patchFunction(
      queryRunner,
      'register_warehouse_withdrawal',
      WITHDRAWAL_BALANCE,
      WITHDRAWAL_BALANCE + WITHDRAWAL_AVAILABLE,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await patchFunction(
      queryRunner,
      'register_warehouse_withdrawal',
      WITHDRAWAL_BALANCE + WITHDRAWAL_AVAILABLE,
      WITHDRAWAL_BALANCE,
    );
    await patchFunction(
      queryRunner,
      'register_warehouse_withdrawal',
      WITHDRAWAL_REQUIRE_BREAKDOWN,
      WITHDRAWAL_NO_BREAKDOWN,
    );
    await patchFunction(
      queryRunner,
      'register_cash_warehouse_transfer',
      TRANSFER_BALANCE + TRANSFER_AVAILABLE,
      TRANSFER_BALANCE,
    );
    await patchFunction(
      queryRunner,
      'register_cash_warehouse_transfer',
      TRANSFER_REQUIRE_BREAKDOWN,
      TRANSFER_NO_BREAKDOWN,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_warehouse_cash_count(JSONB, VARCHAR, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_assert_denominations_available(TEXT, JSONB)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_location_inventory_summary(TEXT)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_location_inventory(TEXT)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_location_anchor(TEXT)`,
    );
    // Tables (warehouse_cash_counts, warehouse_cash_count_details, cash_count_drafts) and rows are kept.
  }
}

const DENOMS = '200, 100, 50, 20, 10, 5, 1, 0.50, 0.25, 0.10, 0.05, 0.01';

const TRANSFER_NO_BREAKDOWN = `        ELSE
          -- Policy: a delivery without denominations needs an administrator.
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        END IF;`;
const TRANSFER_REQUIRE_BREAKDOWN = `        ELSE
          -- Since 1760007800000 every delivery carries its denominations (per-denomination inventory).
          RAISE EXCEPTION 'CASH_CUSTODY_BREAKDOWN_REQUIRED';
        END IF;`;
const TRANSFER_BALANCE = `        IF cash_balance() < p_amount THEN
          RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
        END IF;
`;
const TRANSFER_AVAILABLE = `        -- Every bill/coin sent must be available in the caja inventory (under the caja lock).
        PERFORM cash_assert_denominations_available('CAJA', p_details);
`;
const WITHDRAWAL_NO_BREAKDOWN = `        ELSE
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        END IF;

        -- Lock order bank → caja → Bodega (same as every other flow).`;
const WITHDRAWAL_REQUIRE_BREAKDOWN = `        ELSE
          -- Since 1760007800000 every withdrawal carries its denominations (per-denomination inventory).
          RAISE EXCEPTION 'CASH_CUSTODY_BREAKDOWN_REQUIRED';
        END IF;

        -- Lock order bank → caja → Bodega (same as every other flow).`;
const WITHDRAWAL_BALANCE = `        IF warehouse_cash_balance() < p_amount THEN
          RAISE EXCEPTION 'WAREHOUSE_INSUFFICIENT_BALANCE';
        END IF;
`;
const WITHDRAWAL_AVAILABLE = `        -- Every bill/coin withdrawn must be available in the Bodega inventory (under the Bodega lock).
        PERFORM cash_assert_denominations_available('BODEGA', p_details);
`;

/** Replaces `from` with `to` in the live definition of `name`; fails if the anchor is not there exactly once. */
async function patchFunction(
  queryRunner: QueryRunner,
  name: string,
  from: string,
  to: string,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [name],
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error(`${name}: anchor not found exactly once`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}
