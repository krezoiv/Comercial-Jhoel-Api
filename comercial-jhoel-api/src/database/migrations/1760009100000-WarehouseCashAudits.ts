import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Arqueo de Bodega — a physical count of Bodega that RECORDS its difference
 * (owner request, 2026-11-21: "Estado de Cuenta de Efectivo").
 *
 * Bodega already had `warehouse_cash_counts` (migration 1760007800000), but that
 * count must EQUAL the Bodega balance (`WAREHOUSE_COUNT_MISMATCH`): it is the
 * anchor of the per-denomination inventory that validates withdrawals. The
 * owner chose to keep it exactly as it is and add a separate control count:
 *
 * - `warehouse_cash_audits`: theoretical Bodega balance and last Bodega
 *   sequence read under the Bodega lock, total counted, difference
 *   (counted − theoretical) and CUADRADO / FALTANTE / SOBRANTE, observations,
 *   user, day and time.
 * - `warehouse_cash_audit_details`: one row per denomination (Q200 … Q0.01,
 *   `cash_valid_denomination`), subtotal = denomination × quantity.
 *
 * Rules:
 * - It is a control, never a financial movement: it writes neither Kardex,
 *   changes no balance and never adjusts the difference. A real difference is
 *   corrected with the authorized adjustment, as for Caja.
 * - It never becomes the inventory anchor (that stays `warehouse_cash_counts`).
 * - Same roles as the Arqueo de Caja (`cash_custody.operate`: SUPER_ADMIN,
 *   ADMIN, SUPERVISOR_DE_TURNO), an open bank day, an idempotency key (a retry
 *   returns the same audit) and immutable rows (`cash_custody_status_only_guard`).
 * - It is independent from the Arqueo de Caja: Caja and Bodega are counted
 *   apart and their differences are never netted.
 */
export class WarehouseCashAudits1760009100000 implements MigrationInterface {
  name = 'WarehouseCashAudits1760009100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE warehouse_cash_audits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number BIGSERIAL NOT NULL,
        business_date DATE NOT NULL,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        counted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        warehouse_sequence BIGINT NOT NULL,
        theoretical_balance NUMERIC(14,2) NOT NULL,
        total_counted NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        result VARCHAR(10) NOT NULL,
        observations VARCHAR(500),
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_warehouse_cash_audits_number" UNIQUE (number),
        CONSTRAINT "UQ_warehouse_cash_audits_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_warehouse_cash_audits_counted" CHECK (total_counted >= 0),
        CONSTRAINT "CHK_warehouse_cash_audits_difference" CHECK (difference = total_counted - theoretical_balance),
        CONSTRAINT "CHK_warehouse_cash_audits_result" CHECK (
          (result = 'CUADRADO' AND difference = 0)
          OR (result = 'FALTANTE' AND difference < 0)
          OR (result = 'SOBRANTE' AND difference > 0)
        )
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_warehouse_cash_audits_date" ON warehouse_cash_audits (business_date, counted_at DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_warehouse_cash_audits_sequence" ON warehouse_cash_audits (warehouse_sequence)`,
    );
    await queryRunner.query(`
      CREATE TABLE warehouse_cash_audit_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        audit_id UUID NOT NULL REFERENCES warehouse_cash_audits(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_warehouse_cash_audit_details" UNIQUE (audit_id, denomination),
        CONSTRAINT "CHK_warehouse_cash_audit_details_quantity" CHECK (quantity >= 0),
        CONSTRAINT "CHK_warehouse_cash_audit_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    // Both tables are historical evidence: no update, no delete.
    await queryRunner.query(`
      CREATE TRIGGER trg_warehouse_cash_audits_guard BEFORE UPDATE OR DELETE ON warehouse_cash_audits
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_warehouse_cash_audit_details_guard BEFORE UPDATE OR DELETE ON warehouse_cash_audit_details
        FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard()
    `);

    await queryRunner.query(`
      -- Arqueo de Bodega (control count, migration 1760009100000). Photographs the
      -- Bodega balance under the Bodega lock, stores the count and its difference.
      -- Never writes the Kardex, never adjusts, never becomes the inventory anchor.
      CREATE FUNCTION register_warehouse_cash_audit(
        p_details JSONB,
        p_observations VARCHAR,
        p_user_id UUID,
        p_idempotency_key VARCHAR
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_day RECORD;
        v_row RECORD;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_total NUMERIC(14,2) := 0;
        v_theoretical NUMERIC(14,2);
        v_sequence BIGINT;
        v_difference NUMERIC(14,2);
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_audit:' || p_idempotency_key));
        SELECT id INTO v_existing FROM warehouse_cash_audits WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;

        IF p_details IS NULL OR jsonb_typeof(p_details) <> 'array' OR jsonb_array_length(p_details) = 0 THEN
          RAISE EXCEPTION 'CASH_BREAKDOWN_REQUIRED';
        END IF;
        FOR v_row IN
          SELECT (d->>'denomination')::numeric AS denomination, (d->>'quantity')::numeric AS quantity
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
        IF p_observations IS NOT NULL AND length(p_observations) > 500 THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;

        SELECT * INTO v_day FROM cash_current_bank_day();
        IF v_day.day_opening_id IS NULL THEN
          RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
        END IF;
        -- Theoretical balance read under the Bodega lock: no Bodega movement slips in.
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        v_theoretical := warehouse_cash_balance();
        SELECT COALESCE(max(sequence), 0) INTO v_sequence FROM warehouse_cash_movements;
        v_difference := v_total - v_theoretical;

        INSERT INTO warehouse_cash_audits (
          id, business_date, day_opening_id, warehouse_sequence, theoretical_balance, total_counted,
          difference, result, observations, idempotency_key, created_by
        ) VALUES (
          v_id, v_day.business_date, v_day.day_opening_id, v_sequence, v_theoretical, v_total,
          v_difference,
          CASE WHEN v_difference = 0 THEN 'CUADRADO' WHEN v_difference < 0 THEN 'FALTANTE' ELSE 'SOBRANTE' END,
          NULLIF(btrim(p_observations), ''), p_idempotency_key, p_user_id
        );
        INSERT INTO warehouse_cash_audit_details (audit_id, denomination, quantity, subtotal)
        SELECT v_id, (d->>'denomination')::numeric, (d->>'quantity')::int,
               (d->>'denomination')::numeric * (d->>'quantity')::int
        FROM jsonb_array_elements(p_details) d;
        RETURN v_id;
      END;
      $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only objects created by this migration.
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_warehouse_cash_audit(JSONB, VARCHAR, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS warehouse_cash_audit_details`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS warehouse_cash_audits`);
  }
}
