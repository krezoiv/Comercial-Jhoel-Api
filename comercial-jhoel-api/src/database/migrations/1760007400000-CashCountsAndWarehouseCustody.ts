import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Control de Efectivo → "Arqueo de Caja" and "Entrega de Efectivo a Bodega".
 *
 * Custody model (one source of truth per location, never a second cash Kardex):
 * - Caja  = the existing cash Kardex (`cash_movements`, `cash_balance()`).
 * - Bodega = new Kardex `warehouse_cash_movements` (`warehouse_cash_balance()`),
 *   same shape and rules: previous/new balance CHECK, strict sequence, single
 *   writer under its own advisory lock, idempotency key, voids by reversal,
 *   never negative.
 * - Total bajo custodia = caja + Bodega.
 *
 * Entrega a Bodega (`cash_warehouse_transfers`): ONE transaction writes the
 * caja OUT (`ENTREGA_BODEGA`, reference `WAREHOUSE_TRANSFER`) and the Bodega IN
 * (`ENTREGA_DESDE_CAJA`, same reference) for the same amount. Lock order caja →
 * Bodega everywhere; the caja balance is checked under the caja lock, so two
 * simultaneous deliveries can never leave caja negative. It is an internal
 * transfer: total custody is unchanged and it is labelled as such everywhere.
 * Breakdown (`cash_movement_details`, reused) is optional only for
 * administrators (business policy) and the row records `has_breakdown`.
 * Void (admin, reason) reverses both sides; nothing is deleted.
 *
 * Arqueo de Caja (`cash_counts` + `cash_count_details`): a historical
 * photograph — theoretical caja and Bodega balances read under their locks,
 * counted total, difference and result (CUADRADO / FALTANTE / SOBRANTE). It
 * NEVER writes a Kardex movement or adjusts any balance. Optional physical
 * count of Bodega for the consolidated view. Corrections create a new count
 * (same snapshot, new quantities, reason, admin) and mark the original
 * REEMPLAZADO; counts are otherwise immutable.
 *
 * Cuadre de Agentes is the consolidated cash cuadre: `agent_reconciliations`
 * gains `total_warehouse_cash` (DEFAULT 0, so every historical row keeps its
 * result) and its result formula includes it (also patched in the financial
 * day review correction function).
 *
 * `down` drops functions/triggers and restores the previous function bodies
 * and constraint; tables, columns and rows are kept.
 */
export class CashCountsAndWarehouseCustody1760007400000 implements MigrationInterface {
  name = 'CashCountsAndWarehouseCustody1760007400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Caja Kardex: new movement type (constraint swap, no data touched) ──
    await queryRunner.query(
      `ALTER TABLE cash_movements DROP CONSTRAINT IF EXISTS "CHK_cash_movements_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE cash_movements ADD CONSTRAINT "CHK_cash_movements_type" CHECK (movement_type IN (${CASH_TYPES.concat(
        'ENTREGA_BODEGA',
      )
        .map((t) => `'${t}'`)
        .join(', ')}))`,
    );

    // ── Roles (same map as the API policy) ────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_custody_assert_role(p_user_id UUID, p_permission TEXT) RETURNS VOID
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_role TEXT;
      BEGIN
        SELECT r.name INTO v_role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = p_user_id;
        -- cash_custody.operate → arqueos y entregas; cash_custody.authorize → anulaciones,
        -- correcciones, saldo inicial de Bodega y entregas sin desglose.
        IF v_role IS NULL
           OR (p_permission = 'cash_custody.operate' AND v_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO'))
           OR (p_permission = 'cash_custody.authorize' AND v_role NOT IN ('SUPER_ADMIN', 'ADMIN')) THEN
          RAISE EXCEPTION 'CASH_CUSTODY_FORBIDDEN:%', p_permission;
        END IF;
      END;
      $$
    `);

    // Current bank operational day (latest Agentes Bancarios opening).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_current_bank_day(
        OUT day_opening_id UUID, OUT business_date DATE, OUT is_open BOOLEAN
      )
      LANGUAGE sql STABLE AS $$
        SELECT r.day_opening_id, r.business_date, (o.closed_at IS NULL AND NOT o.is_cancelled)
        FROM cash_bank_day_ranges r JOIN day_openings o ON o.id = r.day_opening_id
        WHERE r.is_current
        LIMIT 1
      $$
    `);

    // ── Bodega Kardex ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS warehouse_cash_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL,
        business_date DATE NULL,
        day_opening_id UUID NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        movement_type VARCHAR(30) NOT NULL,
        direction VARCHAR(4) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        previous_balance NUMERIC(14,2) NOT NULL,
        new_balance NUMERIC(14,2) NOT NULL,
        reference_type VARCHAR(30) NULL,
        reference_id UUID NULL,
        description VARCHAR(255) NOT NULL,
        counterpart VARCHAR(150) NULL,
        reason VARCHAR(255) NULL,
        reversal_of_id UUID NULL REFERENCES warehouse_cash_movements(id) ON DELETE RESTRICT,
        status VARCHAR(10) NOT NULL DEFAULT 'VIGENTE',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_warehouse_cash_movements_sequence" UNIQUE (sequence),
        CONSTRAINT "UQ_warehouse_cash_movements_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_warehouse_cash_movements_type" CHECK (movement_type IN ('SALDO_INICIAL', 'ENTREGA_DESDE_CAJA', 'ANULACION')),
        CONSTRAINT "CHK_warehouse_cash_movements_direction" CHECK (direction IN ('IN', 'OUT')),
        CONSTRAINT "CHK_warehouse_cash_movements_amount" CHECK (amount > 0),
        CONSTRAINT "CHK_warehouse_cash_movements_balance" CHECK (
          new_balance = previous_balance + CASE direction WHEN 'IN' THEN amount ELSE -amount END
        ),
        CONSTRAINT "CHK_warehouse_cash_movements_non_negative" CHECK (new_balance >= 0),
        CONSTRAINT "CHK_warehouse_cash_movements_status" CHECK (status IN ('VIGENTE', 'ANULADO')),
        CONSTRAINT "CHK_warehouse_cash_movements_void" CHECK (
          (status = 'VIGENTE' AND voided_at IS NULL AND voided_by IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL)
        ),
        CONSTRAINT "CHK_warehouse_cash_movements_reversal" CHECK ((movement_type = 'ANULACION') = (reversal_of_id IS NOT NULL)),
        CONSTRAINT "CHK_warehouse_cash_movements_reference" CHECK ((reference_type IS NULL) = (reference_id IS NULL))
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_warehouse_cash_movements_initial" ON warehouse_cash_movements ((true)) WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_warehouse_cash_movements_reversal" ON warehouse_cash_movements (reversal_of_id) WHERE reversal_of_id IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_warehouse_cash_movements_reference" ON warehouse_cash_movements (reference_type, reference_id)`,
    );

    // Kardex rows are history: only VIGENTE → ANULADO (with its void columns) may change.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_custody_status_only_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      DECLARE
        -- No arguments = fully immutable (TG_ARGV is NULL then, not an empty array).
        v_mutable TEXT[] := COALESCE(TG_ARGV, ARRAY[]::TEXT[]);
      BEGIN
        IF TG_OP = 'DELETE' THEN
          RAISE EXCEPTION 'CASH_CUSTODY_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        IF (to_jsonb(NEW) - v_mutable) <> (to_jsonb(OLD) - v_mutable) THEN
          RAISE EXCEPTION 'CASH_CUSTODY_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    await this.guard(queryRunner, 'warehouse_cash_movements', [
      'status',
      'voided_at',
      'voided_by',
      'void_reason',
    ]);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION warehouse_cash_balance() RETURNS NUMERIC
      LANGUAGE sql STABLE AS $$
        SELECT COALESCE((SELECT new_balance FROM warehouse_cash_movements ORDER BY sequence DESC LIMIT 1), 0)
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION warehouse_cash_balance_at_time(p_at TIMESTAMPTZ) RETURNS NUMERIC
      LANGUAGE sql STABLE AS $$
        SELECT COALESCE((SELECT new_balance FROM warehouse_cash_movements WHERE created_at <= p_at
                         ORDER BY sequence DESC LIMIT 1), 0)
      $$
    `);
    // Single writer of the Bodega Kardex (balance read under its lock).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION apply_warehouse_cash_movement(
        p_type VARCHAR, p_direction VARCHAR, p_amount NUMERIC, p_user_id UUID, p_description VARCHAR,
        p_reference_type VARCHAR, p_reference_id UUID, p_counterpart VARCHAR, p_reason VARCHAR,
        p_reversal_of_id UUID, p_idempotency_key VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_previous NUMERIC(14,2);
        v_new NUMERIC(14,2);
        v_day RECORD;
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_existing FROM warehouse_cash_movements WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        v_previous := warehouse_cash_balance();
        v_new := v_previous + CASE p_direction WHEN 'IN' THEN p_amount ELSE -p_amount END;
        IF v_new < 0 THEN
          RAISE EXCEPTION 'WAREHOUSE_INSUFFICIENT_BALANCE';
        END IF;
        SELECT * INTO v_day FROM cash_current_bank_day();
        INSERT INTO warehouse_cash_movements (
          business_date, day_opening_id, movement_type, direction, amount, previous_balance, new_balance,
          reference_type, reference_id, description, counterpart, reason, reversal_of_id, idempotency_key, created_by
        ) VALUES (
          v_day.business_date, v_day.day_opening_id, p_type, p_direction, p_amount, v_previous, v_new,
          p_reference_type, p_reference_id, left(p_description, 255), left(NULLIF(trim(p_counterpart), ''), 150),
          left(NULLIF(trim(p_reason), ''), 255), p_reversal_of_id, p_idempotency_key, p_user_id
        ) RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_warehouse_initial_balance(
        p_amount NUMERIC, p_user_id UUID, p_reason VARCHAR, p_idempotency_key VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        IF EXISTS (SELECT 1 FROM warehouse_cash_movements WHERE idempotency_key = p_idempotency_key) THEN
          RETURN (SELECT id FROM warehouse_cash_movements WHERE idempotency_key = p_idempotency_key);
        END IF;
        IF EXISTS (SELECT 1 FROM warehouse_cash_movements) THEN
          RAISE EXCEPTION 'WAREHOUSE_INITIAL_BALANCE_EXISTS';
        END IF;
        RETURN apply_warehouse_cash_movement('SALDO_INICIAL', 'IN', p_amount, p_user_id,
          'Saldo inicial de Bodega', NULL, NULL, NULL, p_reason, NULL, p_idempotency_key);
      END;
      $$
    `);

    // ── Entrega de efectivo a Bodega ──────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_warehouse_transfers (
        id UUID PRIMARY KEY,
        number BIGSERIAL NOT NULL,
        reference_number VARCHAR(20) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        delivered_by VARCHAR(150) NOT NULL,
        received_by VARCHAR(150) NOT NULL,
        voucher_reference VARCHAR(100) NULL,
        observations VARCHAR(500) NULL,
        has_breakdown BOOLEAN NOT NULL,
        business_date DATE NOT NULL,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        cash_movement_id UUID NOT NULL REFERENCES cash_movements(id) ON DELETE RESTRICT,
        warehouse_movement_id UUID NOT NULL REFERENCES warehouse_cash_movements(id) ON DELETE RESTRICT,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADA',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_warehouse_transfers_number" UNIQUE (number),
        CONSTRAINT "UQ_cash_warehouse_transfers_reference" UNIQUE (reference_number),
        CONSTRAINT "UQ_cash_warehouse_transfers_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "UQ_cash_warehouse_transfers_cash" UNIQUE (cash_movement_id),
        CONSTRAINT "UQ_cash_warehouse_transfers_warehouse" UNIQUE (warehouse_movement_id),
        CONSTRAINT "CHK_cash_warehouse_transfers_amount" CHECK (amount > 0),
        CONSTRAINT "CHK_cash_warehouse_transfers_people" CHECK (length(btrim(delivered_by)) >= 3 AND length(btrim(received_by)) >= 3),
        CONSTRAINT "CHK_cash_warehouse_transfers_status" CHECK (status IN ('APLICADA', 'ANULADA')),
        CONSTRAINT "CHK_cash_warehouse_transfers_void" CHECK (
          (status = 'APLICADA' AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR (status = 'ANULADA' AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_warehouse_transfers_date" ON cash_warehouse_transfers (business_date, created_at)`,
    );
    await this.guard(queryRunner, 'cash_warehouse_transfers', [
      'status',
      'voided_at',
      'voided_by',
      'void_reason',
    ]);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_cash_warehouse_transfer(
        p_amount NUMERIC, p_details JSONB, p_delivered_by VARCHAR, p_received_by VARCHAR,
        p_voucher_reference VARCHAR, p_observations VARCHAR, p_user_id UUID, p_idempotency_key VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_day RECORD;
        v_row RECORD;
        v_total NUMERIC(14,2) := 0;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_has_breakdown BOOLEAN := p_details IS NOT NULL AND jsonb_typeof(p_details) = 'array' AND jsonb_array_length(p_details) > 0;
        v_cash_id UUID;
        v_warehouse_id UUID;
        v_number BIGINT;
        v_label TEXT;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_warehouse_transfer:' || p_idempotency_key));
        SELECT id INTO v_existing FROM cash_warehouse_transfers WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        IF p_delivered_by IS NULL OR length(btrim(p_delivered_by)) < 3
           OR p_received_by IS NULL OR length(btrim(p_received_by)) < 3 THEN
          RAISE EXCEPTION 'CASH_WAREHOUSE_PEOPLE_REQUIRED';
        END IF;
        SELECT * INTO v_day FROM cash_current_bank_day();
        IF v_day.day_opening_id IS NULL OR NOT v_day.is_open THEN
          RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
        END IF;

        IF v_has_breakdown THEN
          FOR v_row IN
            SELECT (d->>'denomination')::numeric AS denomination, (d->>'quantity')::numeric AS quantity
            FROM jsonb_array_elements(p_details) d
          LOOP
            IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
               OR v_row.quantity IS NULL OR v_row.quantity <= 0 OR v_row.quantity <> trunc(v_row.quantity)
               OR v_row.denomination = ANY (v_seen) THEN
              RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
            END IF;
            v_seen := v_seen || v_row.denomination;
            v_total := v_total + v_row.denomination * v_row.quantity;
          END LOOP;
          IF v_total <> p_amount THEN
            RAISE EXCEPTION 'CASH_BREAKDOWN_MISMATCH';
          END IF;
        ELSE
          -- Policy: a delivery without denominations needs an administrator.
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        END IF;

        -- Lock order caja → Bodega; caja balance checked under the caja lock.
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        IF cash_balance() < p_amount THEN
          RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
        END IF;

        v_number := nextval(pg_get_serial_sequence('cash_warehouse_transfers', 'number'));
        v_label := 'ENT-' || lpad(v_number::text, 6, '0');
        v_cash_id := apply_cash_movement(
          'ENTREGA_BODEGA', 'OUT', p_amount, p_user_id,
          left('Entrega a Bodega ' || v_label || ' (transferencia interna) — recibe ' || btrim(p_received_by), 255),
          'WAREHOUSE_TRANSFER', v_id, NULL, NULL, NULL, 'WHT-CASH:' || p_idempotency_key
        );
        v_warehouse_id := apply_warehouse_cash_movement(
          'ENTREGA_DESDE_CAJA', 'IN', p_amount, p_user_id,
          left('Entrega desde caja ' || v_label || ' — entrega ' || btrim(p_delivered_by), 255),
          'WAREHOUSE_TRANSFER', v_id, btrim(p_received_by), NULL, NULL, 'WHT-WH:' || p_idempotency_key
        );
        IF v_has_breakdown THEN
          INSERT INTO cash_movement_details (movement_id, denomination, quantity, subtotal)
          SELECT v_cash_id, (d->>'denomination')::numeric, (d->>'quantity')::int,
                 (d->>'denomination')::numeric * (d->>'quantity')::int
          FROM jsonb_array_elements(p_details) d;
        END IF;

        INSERT INTO cash_warehouse_transfers (
          id, number, reference_number, amount, delivered_by, received_by, voucher_reference, observations,
          has_breakdown, business_date, day_opening_id, cash_movement_id, warehouse_movement_id,
          idempotency_key, created_by
        ) VALUES (
          v_id, v_number, v_label, p_amount, btrim(p_delivered_by), btrim(p_received_by),
          NULLIF(btrim(p_voucher_reference), ''), NULLIF(btrim(p_observations), ''),
          v_has_breakdown, v_day.business_date, v_day.day_opening_id, v_cash_id, v_warehouse_id,
          p_idempotency_key, p_user_id
        );
        RETURN v_id;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_cash_warehouse_transfer(p_transfer_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_transfer cash_warehouse_transfers%ROWTYPE;
        v_wh warehouse_cash_movements%ROWTYPE;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        SELECT * INTO v_transfer FROM cash_warehouse_transfers WHERE id = p_transfer_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_WAREHOUSE_TRANSFER_NOT_FOUND';
        END IF;
        IF v_transfer.status = 'ANULADA' THEN
          RAISE EXCEPTION 'CASH_WAREHOUSE_TRANSFER_ALREADY_VOIDED';
        END IF;
        -- Bodega side: the money must still be there.
        SELECT * INTO v_wh FROM warehouse_cash_movements WHERE id = v_transfer.warehouse_movement_id FOR UPDATE;
        PERFORM apply_warehouse_cash_movement('ANULACION', 'OUT', v_wh.amount, p_user_id,
          left('Anulación de ' || v_transfer.reference_number || ' — ' || trim(p_reason), 255),
          'WAREHOUSE_TRANSFER', v_transfer.id, NULL, trim(p_reason), v_wh.id, 'REV:' || v_wh.id);
        UPDATE warehouse_cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = v_wh.id;
        -- Caja side: existing reversal (ANULACION + original ANULADO).
        PERFORM reverse_cash_movement(v_transfer.cash_movement_id, p_user_id, trim(p_reason));
        UPDATE cash_warehouse_transfers
        SET status = 'ANULADA', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = v_transfer.id;
        RETURN v_transfer.id;
      END;
      $$
    `);

    // The caja side of a delivery is voided only together with its Bodega side.
    await queryRunner.query(voidManualCashMovementSql(true));

    // ── Arqueo de Caja ────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number BIGSERIAL NOT NULL,
        business_date DATE NOT NULL,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        counted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_cash_sequence BIGINT NOT NULL,
        system_cash NUMERIC(14,2) NOT NULL,
        total_counted NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        result VARCHAR(10) NOT NULL,
        warehouse_balance NUMERIC(14,2) NOT NULL,
        warehouse_counted NUMERIC(14,2) NULL,
        warehouse_difference NUMERIC(14,2) NULL,
        custody_theoretical NUMERIC(14,2) NOT NULL,
        observations VARCHAR(500) NULL,
        status VARCHAR(12) NOT NULL DEFAULT 'VIGENTE',
        replaces_id UUID NULL REFERENCES cash_counts(id) ON DELETE RESTRICT,
        replaced_by_id UUID NULL,
        correction_reason VARCHAR(255) NULL,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_counts_number" UNIQUE (number),
        CONSTRAINT "UQ_cash_counts_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "FK_cash_counts_replaced_by" FOREIGN KEY (replaced_by_id) REFERENCES cash_counts(id) DEFERRABLE INITIALLY DEFERRED,
        CONSTRAINT "CHK_cash_counts_counted" CHECK (total_counted >= 0),
        CONSTRAINT "CHK_cash_counts_difference" CHECK (difference = total_counted - system_cash),
        CONSTRAINT "CHK_cash_counts_result" CHECK (
          (result = 'CUADRADO' AND difference = 0) OR (result = 'FALTANTE' AND difference < 0) OR (result = 'SOBRANTE' AND difference > 0)
        ),
        CONSTRAINT "CHK_cash_counts_warehouse" CHECK (
          (warehouse_counted IS NULL AND warehouse_difference IS NULL)
          OR (warehouse_counted >= 0 AND warehouse_difference = warehouse_counted - warehouse_balance)
        ),
        CONSTRAINT "CHK_cash_counts_custody" CHECK (custody_theoretical = system_cash + warehouse_balance),
        CONSTRAINT "CHK_cash_counts_status" CHECK (status IN ('VIGENTE', 'REEMPLAZADO')),
        CONSTRAINT "CHK_cash_counts_replaced" CHECK ((status = 'REEMPLAZADO') = (replaced_by_id IS NOT NULL)),
        CONSTRAINT "CHK_cash_counts_correction" CHECK ((replaces_id IS NULL) = (correction_reason IS NULL))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_counts_date" ON cash_counts (business_date, counted_at DESC)`,
    );
    await this.guard(queryRunner, 'cash_counts', ['status', 'replaced_by_id']);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_count_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_id UUID NOT NULL REFERENCES cash_counts(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_cash_count_details" UNIQUE (count_id, denomination),
        CONSTRAINT "CHK_cash_count_details_quantity" CHECK (quantity >= 0),
        CONSTRAINT "CHK_cash_count_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    await this.guard(queryRunner, 'cash_count_details', []);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_cash_count(
        p_details JSONB, p_observations VARCHAR, p_warehouse_counted NUMERIC, p_user_id UUID,
        p_idempotency_key VARCHAR, p_replaces_id UUID, p_correction_reason VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_original cash_counts%ROWTYPE;
        v_day RECORD;
        v_row RECORD;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_total NUMERIC(14,2) := 0;
        v_system NUMERIC(14,2);
        v_sequence BIGINT;
        v_warehouse NUMERIC(14,2);
        v_business_date DATE;
        v_day_opening UUID;
        v_counted_at TIMESTAMPTZ := now();
        v_difference NUMERIC(14,2);
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_count:' || p_idempotency_key));
        SELECT id INTO v_existing FROM cash_counts WHERE idempotency_key = p_idempotency_key;
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
        IF p_warehouse_counted IS NOT NULL AND (p_warehouse_counted < 0 OR p_warehouse_counted <> round(p_warehouse_counted, 2)) THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;

        IF p_replaces_id IS NOT NULL THEN
          -- Audited correction: keeps the original photograph (balances and day), new quantities.
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
          IF p_correction_reason IS NULL OR length(trim(p_correction_reason)) < 5 THEN
            RAISE EXCEPTION 'CASH_REASON_REQUIRED';
          END IF;
          SELECT * INTO v_original FROM cash_counts WHERE id = p_replaces_id FOR UPDATE;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'CASH_COUNT_NOT_FOUND';
          END IF;
          IF v_original.status <> 'VIGENTE' THEN
            RAISE EXCEPTION 'CASH_COUNT_ALREADY_REPLACED';
          END IF;
          v_system := v_original.system_cash;
          v_sequence := v_original.last_cash_sequence;
          v_warehouse := v_original.warehouse_balance;
          v_business_date := v_original.business_date;
          v_day_opening := v_original.day_opening_id;
          v_counted_at := v_original.counted_at;
        ELSE
          SELECT * INTO v_day FROM cash_current_bank_day();
          IF v_day.day_opening_id IS NULL THEN
            RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
          END IF;
          -- Photograph read under both locks (caja → Bodega): no movement slips in between.
          PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
          PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
          v_system := cash_balance();
          SELECT COALESCE(max(sequence), 0) INTO v_sequence FROM cash_movements;
          v_warehouse := warehouse_cash_balance();
          v_business_date := v_day.business_date;
          v_day_opening := v_day.day_opening_id;
        END IF;

        v_difference := v_total - v_system;
        INSERT INTO cash_counts (
          id, business_date, day_opening_id, counted_at, last_cash_sequence, system_cash, total_counted,
          difference, result, warehouse_balance, warehouse_counted, warehouse_difference, custody_theoretical,
          observations, replaces_id, correction_reason, idempotency_key, created_by
        ) VALUES (
          v_id, v_business_date, v_day_opening, v_counted_at, v_sequence, v_system, v_total,
          v_difference,
          CASE WHEN v_difference = 0 THEN 'CUADRADO' WHEN v_difference < 0 THEN 'FALTANTE' ELSE 'SOBRANTE' END,
          v_warehouse, p_warehouse_counted,
          CASE WHEN p_warehouse_counted IS NULL THEN NULL ELSE p_warehouse_counted - v_warehouse END,
          v_system + v_warehouse, NULLIF(btrim(p_observations), ''), p_replaces_id,
          NULLIF(btrim(p_correction_reason), ''), p_idempotency_key, p_user_id
        );
        INSERT INTO cash_count_details (count_id, denomination, quantity, subtotal)
        SELECT v_id, (d->>'denomination')::numeric, (d->>'quantity')::int,
               (d->>'denomination')::numeric * (d->>'quantity')::int
        FROM jsonb_array_elements(p_details) d;

        IF p_replaces_id IS NOT NULL THEN
          UPDATE cash_counts SET status = 'REEMPLAZADO', replaced_by_id = v_id WHERE id = p_replaces_id;
        END IF;
        RETURN v_id;
      END;
      $$
    `);

    // ── Cuadre de Agentes (consolidated): caja count + Bodega ─────────────
    await queryRunner.query(
      `ALTER TABLE agent_reconciliations ADD COLUMN IF NOT EXISTS total_warehouse_cash NUMERIC(14,2) NOT NULL DEFAULT 0`,
    );
    await patchFunction(
      queryRunner,
      'correct_financial_day_snapshot',
      'RETURNING total_cash + total_banks + total_accounts_receivable - total_assets',
      'RETURNING total_cash + total_warehouse_cash + total_banks + total_accounts_receivable - total_assets',
    ); // close_agent_day stores the Bodega cash in the SAME insert (trailing param, DEFAULT 0).
    await rewriteFunction(
      queryRunner,
      'close_agent_day',
      'close_agent_day(date, numeric, numeric, numeric, numeric, numeric, uuid)',
      CLOSE_AGENT_DAY_PATCH,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await rewriteFunction(
      queryRunner,
      'close_agent_day',
      'close_agent_day(date, numeric, numeric, numeric, numeric, numeric, uuid, numeric)',
      CLOSE_AGENT_DAY_PATCH.map(([from, to]) => [to, from] as [string, string]),
      true,
    );
    await patchFunction(
      queryRunner,
      'correct_financial_day_snapshot',
      'RETURNING total_cash + total_warehouse_cash + total_banks + total_accounts_receivable - total_assets',
      'RETURNING total_cash + total_banks + total_accounts_receivable - total_assets',
    );
    await queryRunner.query(voidManualCashMovementSql(false));
    for (const fn of [
      'register_cash_count(JSONB, VARCHAR, NUMERIC, UUID, VARCHAR, UUID, VARCHAR)',
      'void_cash_warehouse_transfer(UUID, UUID, VARCHAR)',
      'register_cash_warehouse_transfer(NUMERIC, JSONB, VARCHAR, VARCHAR, VARCHAR, VARCHAR, UUID, VARCHAR)',
      'register_warehouse_initial_balance(NUMERIC, UUID, VARCHAR, VARCHAR)',
    ]) {
      await queryRunner.query(`DROP FUNCTION IF EXISTS ${fn}`);
    }
    // Tables, columns, constraints, guard triggers, balance helpers and all rows are kept
    // (the ENTREGA_BODEGA movement type stays allowed: rows may already use it).
  }

  private async guard(
    queryRunner: QueryRunner,
    table: string,
    mutable: string[],
  ): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_${table}_guard ON ${table}`,
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_${table}_guard BEFORE UPDATE OR DELETE ON ${table}
       FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard(${mutable.map((c) => `'${c}'`).join(', ')})`,
    );
  }
}

const CASH_TYPES = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
  'OTRA_TRANSACCION',
  'GASTO_POR_COBRAR',
  'ABONO_POR_COBRAR',
  'ACTIVO',
  'DEVOLUCION_ACTIVO',
  'RETIRO_BANCARIO',
  'ENTRADA_MANUAL',
  'SALIDA_MANUAL',
  'AJUSTE',
  'SALDO_INICIAL',
  'ANULACION',
  'DEPOSITO_BANCARIO',
];

/** `void_manual_cash_movement`; `withWarehouse` adds the route of a delivery to Bodega. */
function voidManualCashMovementSql(withWarehouse: boolean): string {
  const warehouse = withWarehouse
    ? `
        IF v_type = 'ENTREGA_BODEGA' THEN
          -- Both sides together: caja ANULACION + Bodega ANULACION.
          PERFORM void_cash_warehouse_transfer(
            (SELECT reference_id FROM cash_movements WHERE id = p_movement_id), p_user_id, p_reason
          );
          RETURN (SELECT id FROM cash_movements WHERE reversal_of_id = p_movement_id);
        END IF;`
    : '';
  return `
      CREATE OR REPLACE FUNCTION void_manual_cash_movement(p_movement_id uuid, p_user_id uuid, p_reason character varying)
      RETURNS uuid
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_type VARCHAR;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        SELECT movement_type INTO v_type FROM cash_movements WHERE id = p_movement_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_FOUND';
        END IF;
        IF v_type = 'DEPOSITO_BANCARIO' THEN
          RETURN void_cash_bank_deposit(p_movement_id, p_user_id, p_reason);
        END IF;${warehouse}
        IF v_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL') THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_VOIDABLE';
        END IF;
        RETURN reverse_cash_movement(p_movement_id, p_user_id, trim(p_reason));
      END;
      $function$
  `;
}

/** Replaces one literal fragment of a live function definition (fails if the anchor is missing). */
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
  if (rows.length !== 1 || !rows[0].def.includes(from)) {
    throw new Error(`${name}: anchor not found (${from})`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

const CLOSE_AGENT_DAY_PATCH: Array<[string, string]> = [
  [
    'p_result numeric, p_user_id uuid)',
    'p_result numeric, p_user_id uuid, p_total_warehouse_cash numeric DEFAULT 0)',
  ],
  [
    '(date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)',
    '(date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by, total_warehouse_cash)',
  ],
  [
    '(p_date, p_total_cash, p_total_banks, p_total_assets, p_total_accounts_receivable, p_result, p_user_id)',
    '(p_date, p_total_cash, p_total_banks, p_total_assets, p_total_accounts_receivable, p_result, p_user_id, COALESCE(p_total_warehouse_cash, 0))',
  ],
];

/** Drops a function by its exact signature and recreates it from its live definition with literal replacements. */
async function rewriteFunction(
  queryRunner: QueryRunner,
  name: string,
  dropSignature: string,
  replacements: Array<[string, string]>,
  onlyIfPatched = false,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [name],
  )) as Array<{ def: string }>;
  if (rows.length !== 1) {
    throw new Error(`${name}: expected exactly one definition`);
  }
  // `down` of a database where this rewrite never ran: nothing to undo.
  if (onlyIfPatched && !rows[0].def.includes(replacements[0][0])) {
    return;
  }
  const patched = replacements.reduce((text, [from, to]) => {
    if (!text.includes(from)) {
      throw new Error(`${name}: anchor not found (${from})`);
    }
    return text.replace(from, to);
  }, rows[0].def);
  await queryRunner.query(`DROP FUNCTION ${dropSignature}`);
  await queryRunner.query(patched);
}
