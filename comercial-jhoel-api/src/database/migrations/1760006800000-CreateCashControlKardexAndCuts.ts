import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Control de Efectivo — single official physical-cash Kardex + two daily cuts.
 *
 * 1. `transaction_types.cash_effect` (IN/OUT/NONE): explicit classification
 *    of each Transaccionar type's effect on PHYSICAL cash, independent of
 *    `balance_effect` (bank). Backfilled from `balance_effect`: Depósito and
 *    Pago Génesis = IN, Retiro and Desembolso Génesis = OUT, everything else
 *    (Reintegro, Pago de Cheque, Remesas...) = NONE until an admin sets it.
 * 2. `cash_movements`: the ONLY source of the physical cash balance
 *    (`cash_balance()` = `new_balance` of the last row). Only writer:
 *    `apply_cash_movement` (advisory lock `cash_control_main`, previous
 *    balance read under the lock, `idempotency_key` UNIQUE → a retried request
 *    returns the existing row instead of a second movement). Rows are never
 *    deleted or edited: a void marks the row ANULADO and appends the inverse
 *    ANULACION (`reversal_of_id`). NONE rows (operations that move no cash)
 *    are recorded too, with previous = new balance, so "últimas
 *    transacciones" can show them grey with the official balance.
 * 3. Triggers (same transaction as the source operation — atomic):
 *    - `bank_deposit_operations` insert/void (Transaccionar). Cooperativa
 *      Guayacán operations are NONE here: they move the Guayacán caja only.
 *    - `accounts_receivable` (CARGO = gasto por cobrar → OUT; ABONO → IN) and
 *      `assets` (CARGO = activo → IN; ABONO = devolución → OUT): insert, and
 *      edits/deactivations of rows already tracked (reverse + re-apply).
 *      Rows created before this migration are never touched.
 *    - `bank_account_movements` RETIRO_EFECTIVO (retiro de efectivo en banco
 *      → caja) → IN; its void → reversal.
 *    No historical operation is backfilled: the Kardex starts at 0 and the
 *    real starting cash is set once with an authorized SALDO_INICIAL.
 * 4. `cash_operational_days` (opening snapshot inherited from the last
 *    counted cut, never invented), `cash_cut_periods` (two per day; at most
 *    ONE open cut system-wide), `cash_cut_counts` + details (arqueo),
 *    `cash_cut_bank_reconciliations`, `cash_cut_schedule_changes` and
 *    `cash_cut_events` (audit). Each cut covers the Kardex range
 *    (start_sequence, closing_sequence]: the next cut starts where the
 *    previous finalized one ended, so no movement is counted twice or lost.
 *
 * `down` removes the triggers and functions (the system stops writing) but
 * keeps every table, column and row — no information is deleted.
 */
export class CreateCashControlKardexAndCuts1760006800000 implements MigrationInterface {
  name = 'CreateCashControlKardexAndCuts1760006800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- 1. Explicit cash classification on transaction types ---
    await queryRunner.query(`
      ALTER TABLE transaction_types
        ADD COLUMN IF NOT EXISTS cash_effect VARCHAR(10) NULL
    `);
    await queryRunner.query(`
      UPDATE transaction_types
      SET cash_effect = CASE balance_effect
        WHEN 'DEPOSITO' THEN 'IN'
        WHEN 'PAGO_GENESIS' THEN 'IN'
        WHEN 'RETIRO' THEN 'OUT'
        WHEN 'DESEMBOLSO_GENESIS' THEN 'OUT'
        ELSE 'NONE'
      END
      WHERE cash_effect IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE transaction_types
        ALTER COLUMN cash_effect SET DEFAULT 'NONE',
        ALTER COLUMN cash_effect SET NOT NULL,
        DROP CONSTRAINT IF EXISTS "CHK_transaction_types_cash_effect",
        ADD CONSTRAINT "CHK_transaction_types_cash_effect" CHECK (cash_effect IN ('IN', 'OUT', 'NONE'))
    `);

    // --- 2. Operational days and cut periods (referenced by the Kardex) ---
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_operational_days (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        operational_date DATE NOT NULL,
        status VARCHAR(15) NOT NULL DEFAULT 'ABIERTO',
        opening_policy VARCHAR(40) NOT NULL,
        previous_day_id UUID NULL REFERENCES cash_operational_days(id) ON DELETE RESTRICT,
        previous_cut_id UUID NULL,
        previous_closing_physical_cash NUMERIC(14,2) NULL,
        previous_closing_system_cash NUMERIC(14,2) NULL,
        inherited_difference NUMERIC(14,2) NOT NULL DEFAULT 0,
        opening_sequence BIGINT NOT NULL DEFAULT 0,
        opening_system_cash NUMERIC(14,2) NOT NULL,
        opening_physical_cash NUMERIC(14,2) NOT NULL,
        opening_reason VARCHAR(255) NULL,
        opened_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        closing_sequence BIGINT NULL,
        closing_system_cash NUMERIC(14,2) NULL,
        closing_physical_cash NUMERIC(14,2) NULL,
        closing_difference NUMERIC(14,2) NULL,
        total_in NUMERIC(14,2) NULL,
        total_out NUMERIC(14,2) NULL,
        movement_count INT NULL,
        closing_observations VARCHAR(500) NULL,
        closed_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        closed_at TIMESTAMPTZ NULL,
        CONSTRAINT "UQ_cash_operational_days_date" UNIQUE (operational_date),
        CONSTRAINT "CHK_cash_operational_days_status" CHECK (status IN ('ABIERTO', 'CERRADO')),
        CONSTRAINT "CHK_cash_operational_days_policy" CHECK (opening_policy IN (
          'INHERITED_FROM_CLOSE', 'INHERITED_FROM_LAST_CUT', 'AUTHORIZED_MANUAL', 'SYSTEM_UNVERIFIED'
        )),
        CONSTRAINT "CHK_cash_operational_days_closed" CHECK (
          (status = 'ABIERTO' AND closed_at IS NULL AND closed_by IS NULL)
          OR (status = 'CERRADO' AND closed_at IS NOT NULL AND closed_by IS NOT NULL
              AND closing_physical_cash IS NOT NULL AND closing_system_cash IS NOT NULL)
        )
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_periods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        operational_day_id UUID NOT NULL REFERENCES cash_operational_days(id) ON DELETE RESTRICT,
        period_number SMALLINT NOT NULL,
        scheduled_start_at TIMESTAMPTZ NOT NULL,
        scheduled_end_at TIMESTAMPTZ NOT NULL,
        actual_started_at TIMESTAMPTZ NULL,
        actual_finished_at TIMESTAMPTZ NULL,
        status VARCHAR(15) NOT NULL DEFAULT 'PROGRAMADO',
        start_sequence BIGINT NULL,
        closing_sequence BIGINT NULL,
        opening_system_cash NUMERIC(14,2) NULL,
        opening_physical_cash NUMERIC(14,2) NULL,
        inherited_difference NUMERIC(14,2) NULL,
        closing_system_cash NUMERIC(14,2) NULL,
        closing_physical_cash NUMERIC(14,2) NULL,
        cash_difference NUMERIC(14,2) NULL,
        total_in NUMERIC(14,2) NULL,
        total_out NUMERIC(14,2) NULL,
        movement_count INT NULL,
        opening_bank_balances JSONB NULL,
        opened_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        closed_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        observations VARCHAR(500) NULL,
        reopened_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_cut_periods_day_number" UNIQUE (operational_day_id, period_number),
        CONSTRAINT "CHK_cash_cut_periods_number" CHECK (period_number IN (1, 2)),
        CONSTRAINT "CHK_cash_cut_periods_schedule" CHECK (scheduled_end_at > scheduled_start_at),
        CONSTRAINT "CHK_cash_cut_periods_status" CHECK (status IN ('PROGRAMADO', 'ABIERTO', 'FINALIZADO')),
        CONSTRAINT "CHK_cash_cut_periods_state" CHECK (
          (status = 'PROGRAMADO' AND actual_started_at IS NULL AND actual_finished_at IS NULL)
          OR (status = 'ABIERTO' AND actual_started_at IS NOT NULL AND actual_finished_at IS NULL
              AND start_sequence IS NOT NULL AND opened_by IS NOT NULL)
          OR (status = 'FINALIZADO' AND actual_started_at IS NOT NULL AND actual_finished_at IS NOT NULL
              AND closing_sequence IS NOT NULL AND closing_physical_cash IS NOT NULL
              AND closing_system_cash IS NOT NULL AND closed_by IS NOT NULL)
        )
      )
    `);
    // Never two open cuts at the same time (any cash box/day).
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_cash_cut_periods_single_open"
        ON cash_cut_periods ((true)) WHERE status = 'ABIERTO'
    `);
    await queryRunner.query(`
      ALTER TABLE cash_operational_days
        DROP CONSTRAINT IF EXISTS "FK_cash_operational_days_previous_cut",
        ADD CONSTRAINT "FK_cash_operational_days_previous_cut"
          FOREIGN KEY (previous_cut_id) REFERENCES cash_cut_periods(id) ON DELETE RESTRICT
    `);

    // --- 3. Kardex de efectivo ---
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL,
        operational_date DATE NOT NULL,
        operational_day_id UUID NULL REFERENCES cash_operational_days(id) ON DELETE RESTRICT,
        cut_period_id UUID NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        movement_type VARCHAR(30) NOT NULL,
        direction VARCHAR(4) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        previous_balance NUMERIC(14,2) NOT NULL,
        new_balance NUMERIC(14,2) NOT NULL,
        reference_type VARCHAR(30) NULL,
        reference_id UUID NULL,
        description VARCHAR(255) NOT NULL,
        bank_name VARCHAR(150) NULL,
        reason VARCHAR(255) NULL,
        reversal_of_id UUID NULL REFERENCES cash_movements(id) ON DELETE RESTRICT,
        status VARCHAR(10) NOT NULL DEFAULT 'VIGENTE',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_movements_sequence" UNIQUE (sequence),
        CONSTRAINT "UQ_cash_movements_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_cash_movements_amount" CHECK (amount > 0),
        CONSTRAINT "CHK_cash_movements_direction" CHECK (direction IN ('IN', 'OUT', 'NONE')),
        CONSTRAINT "CHK_cash_movements_balance" CHECK (
          new_balance = previous_balance + CASE direction WHEN 'IN' THEN amount WHEN 'OUT' THEN -amount ELSE 0 END
        ),
        CONSTRAINT "CHK_cash_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', 'OTRA_TRANSACCION',
          'GASTO_POR_COBRAR', 'ABONO_POR_COBRAR', 'ACTIVO', 'DEVOLUCION_ACTIVO', 'RETIRO_BANCARIO',
          'ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL', 'ANULACION'
        )),
        CONSTRAINT "CHK_cash_movements_status" CHECK (status IN ('VIGENTE', 'ANULADO')),
        CONSTRAINT "CHK_cash_movements_void" CHECK (
          (status = 'VIGENTE' AND voided_at IS NULL AND voided_by IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL)
        ),
        CONSTRAINT "CHK_cash_movements_reversal" CHECK ((movement_type = 'ANULACION') = (reversal_of_id IS NOT NULL)),
        CONSTRAINT "CHK_cash_movements_reference_pair" CHECK ((reference_type IS NULL) = (reference_id IS NULL))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_movements_date" ON cash_movements (operational_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_movements_reference" ON cash_movements (reference_type, reference_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_movements_cut" ON cash_movements (cut_period_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_movements_user" ON cash_movements (created_by)`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_cash_movements_reversal"
        ON cash_movements (reversal_of_id) WHERE reversal_of_id IS NOT NULL
    `);
    // The starting cash is loaded once (a void frees it for a corrected one).
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_cash_movements_initial_balance"
        ON cash_movements ((true)) WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE'
    `);

    // --- 4. Arqueos, bank reconciliation, audit ---
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cut_period_id UUID NOT NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        total_counted NUMERIC(14,2) NOT NULL CHECK (total_counted >= 0),
        system_cash NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        observations VARCHAR(500) NULL,
        is_current BOOLEAN NOT NULL DEFAULT true,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_cash_cut_counts_difference" CHECK (difference = total_counted - system_cash)
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_cash_cut_counts_current"
        ON cash_cut_counts (cut_period_id) WHERE is_current
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_count_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_id UUID NOT NULL REFERENCES cash_cut_counts(id) ON DELETE RESTRICT,
        denomination NUMERIC(6,2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_cash_cut_count_details" UNIQUE (count_id, denomination),
        CONSTRAINT "CHK_cash_cut_count_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_bank_reconciliations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cut_period_id UUID NOT NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        count_id UUID NOT NULL REFERENCES cash_cut_counts(id) ON DELETE RESTRICT,
        bank_id UUID NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,
        bank_name VARCHAR(150) NOT NULL,
        system_balance NUMERIC(14,2) NOT NULL,
        verified_balance NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        observations VARCHAR(500) NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_cut_bank_reconciliations" UNIQUE (count_id, bank_id),
        CONSTRAINT "CHK_cash_cut_bank_reconciliations_difference" CHECK (difference = verified_balance - system_balance)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_schedule_changes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cut_period_id UUID NOT NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        previous_start_at TIMESTAMPTZ NOT NULL,
        previous_end_at TIMESTAMPTZ NOT NULL,
        new_start_at TIMESTAMPTZ NOT NULL,
        new_end_at TIMESTAMPTZ NOT NULL,
        reason VARCHAR(255) NOT NULL,
        changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_cut_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cut_period_id UUID NOT NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        action VARCHAR(15) NOT NULL CHECK (action IN ('INICIADO', 'FINALIZADO', 'REABIERTO')),
        reason VARCHAR(255) NULL,
        snapshot JSONB NULL,
        performed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        performed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_cut_events_period" ON cash_cut_events (cut_period_id)`,
    );

    // --- 5. Kardex functions ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_balance()
      RETURNS NUMERIC
      LANGUAGE sql STABLE
      AS $fn$
        SELECT COALESCE((SELECT new_balance FROM cash_movements ORDER BY sequence DESC LIMIT 1), 0)
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_balance_at(p_sequence BIGINT)
      RETURNS NUMERIC
      LANGUAGE sql STABLE
      AS $fn$
        SELECT COALESCE((
          SELECT new_balance FROM cash_movements WHERE sequence <= p_sequence ORDER BY sequence DESC LIMIT 1
        ), 0)
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_guatemala_ts(p_date DATE, p_time TIME)
      RETURNS TIMESTAMPTZ
      LANGUAGE sql IMMUTABLE
      AS $fn$ SELECT (p_date + p_time) AT TIME ZONE 'America/Guatemala' $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_valid_denomination(p_value NUMERIC)
      RETURNS BOOLEAN
      LANGUAGE sql IMMUTABLE
      AS $fn$ SELECT p_value IN (200, 100, 50, 20, 10, 5, 1, 0.50, 0.25, 0.10, 0.05) $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION apply_cash_movement(
        p_movement_type VARCHAR,
        p_direction VARCHAR,
        p_amount NUMERIC,
        p_user_id UUID,
        p_description VARCHAR,
        p_reference_type VARCHAR,
        p_reference_id UUID,
        p_bank_name VARCHAR,
        p_reason VARCHAR,
        p_reversal_of_id UUID,
        p_idempotency_key VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_existing UUID;
        v_previous NUMERIC(14,2);
        v_new NUMERIC(14,2);
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
        v_day_id UUID;
        v_period_id UUID;
        v_period_day_id UUID;
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));

        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_existing FROM cash_movements WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        IF p_direction NOT IN ('IN', 'OUT', 'NONE') THEN
          RAISE EXCEPTION 'CASH_INVALID_DIRECTION';
        END IF;

        v_previous := cash_balance();
        v_new := v_previous + CASE p_direction WHEN 'IN' THEN p_amount WHEN 'OUT' THEN -p_amount ELSE 0 END;

        SELECT id INTO v_day_id FROM cash_operational_days WHERE operational_date = v_date;
        -- Cut attribution: the open cut, else the next pending cut of today.
        SELECT id, operational_day_id INTO v_period_id, v_period_day_id
        FROM cash_cut_periods WHERE status = 'ABIERTO' LIMIT 1;
        IF v_period_id IS NULL AND v_day_id IS NOT NULL THEN
          SELECT id, operational_day_id INTO v_period_id, v_period_day_id
          FROM cash_cut_periods
          WHERE operational_day_id = v_day_id AND status = 'PROGRAMADO'
          ORDER BY period_number LIMIT 1;
        END IF;

        INSERT INTO cash_movements (
          operational_date, operational_day_id, cut_period_id, movement_type, direction, amount,
          previous_balance, new_balance, reference_type, reference_id, description, bank_name,
          reason, reversal_of_id, idempotency_key, created_by
        ) VALUES (
          v_date, COALESCE(v_period_day_id, v_day_id), v_period_id, p_movement_type, p_direction, round(p_amount, 2),
          v_previous, v_new, p_reference_type, p_reference_id, left(p_description, 255), left(p_bank_name, 150),
          left(p_reason, 255), p_reversal_of_id, p_idempotency_key, p_user_id
        )
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reverse_cash_movement(p_movement_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_movement cash_movements%ROWTYPE;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));

        SELECT * INTO v_movement FROM cash_movements WHERE id = p_movement_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_FOUND';
        END IF;
        IF v_movement.movement_type = 'ANULACION' THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_VOIDABLE';
        END IF;
        IF v_movement.status = 'ANULADO' THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_ALREADY_VOIDED';
        END IF;

        UPDATE cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id,
            void_reason = left(COALESCE(p_reason, 'Anulación'), 255)
        WHERE id = p_movement_id;

        RETURN apply_cash_movement(
          'ANULACION',
          CASE v_movement.direction WHEN 'IN' THEN 'OUT' WHEN 'OUT' THEN 'IN' ELSE 'NONE' END,
          v_movement.amount, p_user_id,
          left('Anulación — ' || v_movement.description, 255),
          v_movement.reference_type, v_movement.reference_id, v_movement.bank_name,
          p_reason, v_movement.id, 'REV:' || v_movement.id
        );
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reverse_cash_movements_for_reference(
        p_reference_type VARCHAR, p_reference_id UUID, p_user_id UUID, p_reason VARCHAR
      )
      RETURNS INT
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_count INT := 0;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        FOR v_id IN
          SELECT id FROM cash_movements
          WHERE reference_type = p_reference_type AND reference_id = p_reference_id
            AND status = 'VIGENTE' AND movement_type <> 'ANULACION'
          ORDER BY sequence
        LOOP
          PERFORM reverse_cash_movement(v_id, p_user_id, p_reason);
          v_count := v_count + 1;
        END LOOP;
        RETURN v_count;
      END;
      $fn$;
    `);

    // --- 6. Triggers on the source operations ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_bank_deposit_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type_name VARCHAR;
        v_balance_effect VARCHAR;
        v_cash_effect VARCHAR;
        v_agent_name VARCHAR;
        v_agent_code VARCHAR;
        v_account_name VARCHAR;
        v_movement VARCHAR;
        v_direction VARCHAR;
        v_description VARCHAR;
      BEGIN
        IF NEW.is_voided THEN
          RETURN NEW;
        END IF;

        SELECT name, balance_effect, cash_effect INTO v_type_name, v_balance_effect, v_cash_effect
        FROM transaction_types WHERE id = NEW.transaction_type_id;
        IF NEW.transaction_bank_id IS NOT NULL THEN
          SELECT name, cash_box_code INTO v_agent_name, v_agent_code
          FROM transaction_banks WHERE id = NEW.transaction_bank_id;
        END IF;
        IF NEW.bank_account_id IS NOT NULL THEN
          SELECT name INTO v_account_name FROM banks WHERE id = NEW.bank_account_id;
        END IF;

        v_movement := CASE v_balance_effect
          WHEN 'DEPOSITO' THEN 'DEPOSITO'
          WHEN 'RETIRO' THEN 'RETIRO'
          WHEN 'DESEMBOLSO_GENESIS' THEN 'DESEMBOLSO_GENESIS'
          WHEN 'PAGO_GENESIS' THEN 'PAGO_GENESIS'
          WHEN 'REINTEGRO' THEN 'REINTEGRO'
          ELSE 'OTRA_TRANSACCION'
        END;
        v_direction := COALESCE(v_cash_effect, 'NONE');
        v_description := v_type_name || ' — ' || NEW.transaction_count
          || CASE WHEN NEW.transaction_count = 1 THEN ' trans.' ELSE ' trans.' END
          || COALESCE(' — ' || NULLIF(trim(NEW.client_name), ''), '');

        -- Cooperativa Guayacán has its own caja (Cuadre de Caja Guayacán):
        -- recorded here for visibility only, never counted twice.
        IF v_agent_code = 'GUAYACAN' THEN
          v_direction := 'NONE';
          v_description := v_description || ' (Caja Guayacán)';
        END IF;

        PERFORM apply_cash_movement(
          v_movement, v_direction, NEW.total_amount, NEW.user_id, v_description,
          'BANK_DEPOSIT', NEW.id, COALESCE(v_account_name, v_agent_name), NULL, NULL,
          'BDO:' || NEW.id
        );
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_bank_deposit_void()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      BEGIN
        PERFORM reverse_cash_movements_for_reference(
          'BANK_DEPOSIT', NEW.id, COALESCE(NEW.voided_by, NEW.user_id),
          COALESCE(NEW.void_reason, 'Operación anulada')
        );
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_deposit_insert ON bank_deposit_operations`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_deposit_insert
        AFTER INSERT ON bank_deposit_operations
        FOR EACH ROW EXECUTE FUNCTION cash_on_bank_deposit_insert()
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_deposit_void ON bank_deposit_operations`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_deposit_void
        AFTER UPDATE OF is_voided ON bank_deposit_operations
        FOR EACH ROW WHEN (OLD.is_voided = false AND NEW.is_voided = true)
        EXECUTE FUNCTION cash_on_bank_deposit_void()
    `);

    // Cartera: shared function for accounts_receivable (gastos por cobrar) and assets (activos).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_portfolio_row()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_is_receivable BOOLEAN := TG_TABLE_NAME = 'accounts_receivable';
        v_reference_type VARCHAR := CASE WHEN TG_TABLE_NAME = 'accounts_receivable' THEN 'ACCOUNT_RECEIVABLE' ELSE 'ASSET' END;
        v_movement VARCHAR;
        v_direction VARCHAR;
        v_label VARCHAR;
        v_client VARCHAR;
        v_version INT;
        v_user UUID := NEW.created_by;
      BEGIN
        IF TG_OP = 'UPDATE' THEN
          -- Rows that existed before Control de Efectivo were never in the Kardex: leave them alone.
          IF NOT EXISTS (
            SELECT 1 FROM cash_movements WHERE reference_type = v_reference_type AND reference_id = NEW.id
          ) THEN
            RETURN NEW;
          END IF;
          v_user := COALESCE(NEW.updated_by, NEW.created_by);
          PERFORM reverse_cash_movements_for_reference(
            v_reference_type, NEW.id, v_user,
            CASE WHEN NOT NEW.is_active THEN 'Registro desactivado' ELSE 'Registro modificado' END
          );
        END IF;

        IF NOT NEW.is_active THEN
          RETURN NEW;
        END IF;

        IF v_is_receivable THEN
          IF NEW.movement_type = 'ABONO' THEN
            v_movement := 'ABONO_POR_COBRAR'; v_direction := 'IN'; v_label := 'Abono cuenta por cobrar';
          ELSE
            v_movement := 'GASTO_POR_COBRAR'; v_direction := 'OUT'; v_label := 'Gasto por cobrar';
          END IF;
        ELSE
          IF NEW.movement_type = 'ABONO' THEN
            v_movement := 'DEVOLUCION_ACTIVO'; v_direction := 'OUT'; v_label := 'Devolución de activo';
          ELSE
            v_movement := 'ACTIVO'; v_direction := 'IN'; v_label := 'Activo';
          END IF;
        END IF;

        SELECT name INTO v_client FROM clients WHERE id = NEW.client_id;
        SELECT count(*) + 1 INTO v_version
        FROM cash_movements
        WHERE reference_type = v_reference_type AND reference_id = NEW.id AND movement_type <> 'ANULACION';

        PERFORM apply_cash_movement(
          v_movement, v_direction, NEW.amount, v_user,
          v_label || COALESCE(' — ' || v_client, '') || COALESCE(' — ' || NULLIF(trim(NEW.description), ''), ''),
          v_reference_type, NEW.id, NULL, NULL, NULL,
          v_reference_type || ':' || NEW.id || ':' || v_version
        );
        RETURN NEW;
      END;
      $fn$;
    `);
    for (const table of ['accounts_receivable', 'assets']) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_cash_${table}_insert ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_cash_${table}_insert
          AFTER INSERT ON ${table}
          FOR EACH ROW EXECUTE FUNCTION cash_on_portfolio_row()
      `);
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_cash_${table}_update ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_cash_${table}_update
          AFTER UPDATE OF amount, movement_type, is_active ON ${table}
          FOR EACH ROW WHEN (
            OLD.amount IS DISTINCT FROM NEW.amount
            OR OLD.movement_type IS DISTINCT FROM NEW.movement_type
            OR OLD.is_active IS DISTINCT FROM NEW.is_active
          )
          EXECUTE FUNCTION cash_on_portfolio_row()
      `);
    }

    // Retiro de efectivo en banco (Transferencias Bancarias): the money leaves the account and enters the caja.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_bank_movement_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank_name VARCHAR;
      BEGIN
        SELECT name INTO v_bank_name FROM banks WHERE id = NEW.bank_id;
        PERFORM apply_cash_movement(
          'RETIRO_BANCARIO', 'IN', abs(NEW.amount), NEW.user_id,
          'Retiro de efectivo en banco hacia caja' || COALESCE(' — ' || NULLIF(trim(NEW.concept), ''), ''),
          'BANK_MOVEMENT', NEW.id, v_bank_name, NULL, NULL, 'BAM:' || NEW.id
        );
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_bank_movement_void()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      BEGIN
        PERFORM reverse_cash_movements_for_reference(
          'BANK_MOVEMENT', NEW.id, COALESCE(NEW.reversed_by, NEW.user_id), 'Retiro bancario anulado'
        );
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_movement_insert ON bank_account_movements`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_movement_insert
        AFTER INSERT ON bank_account_movements
        FOR EACH ROW WHEN (NEW.movement_type = 'RETIRO_EFECTIVO')
        EXECUTE FUNCTION cash_on_bank_movement_insert()
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_movement_void ON bank_account_movements`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_movement_void
        AFTER UPDATE OF status ON bank_account_movements
        FOR EACH ROW WHEN (
          OLD.status = 'APLICADO' AND NEW.status = 'ANULADO' AND NEW.movement_type = 'RETIRO_EFECTIVO'
        )
        EXECUTE FUNCTION cash_on_bank_movement_void()
    `);

    // --- 7. Manual movements (entrada/salida/ajuste/saldo inicial) and their void ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_manual_cash_movement(
        p_movement_type VARCHAR, p_amount NUMERIC, p_user_id UUID, p_description VARCHAR,
        p_reason VARCHAR, p_idempotency_key VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_direction VARCHAR;
      BEGIN
        IF p_movement_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL') THEN
          RAISE EXCEPTION 'CASH_INVALID_MOVEMENT_TYPE';
        END IF;
        IF p_amount IS NULL OR p_amount = 0 THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        IF p_movement_type IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'SALDO_INICIAL') AND p_amount < 0 THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;

        v_direction := CASE p_movement_type
          WHEN 'ENTRADA_MANUAL' THEN 'IN'
          WHEN 'SALDO_INICIAL' THEN 'IN'
          WHEN 'SALIDA_MANUAL' THEN 'OUT'
          ELSE CASE WHEN p_amount > 0 THEN 'IN' ELSE 'OUT' END
        END;

        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        IF p_movement_type = 'SALDO_INICIAL' AND EXISTS (
          SELECT 1 FROM cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE'
            AND idempotency_key <> p_idempotency_key
        ) THEN
          RAISE EXCEPTION 'CASH_INITIAL_BALANCE_EXISTS';
        END IF;

        RETURN apply_cash_movement(
          p_movement_type, v_direction, abs(p_amount), p_user_id,
          COALESCE(NULLIF(trim(p_description), ''), CASE p_movement_type
            WHEN 'ENTRADA_MANUAL' THEN 'Entrada manual de efectivo'
            WHEN 'SALIDA_MANUAL' THEN 'Salida manual de efectivo'
            WHEN 'SALDO_INICIAL' THEN 'Saldo inicial de efectivo'
            ELSE 'Ajuste de efectivo'
          END),
          NULL, NULL, NULL, trim(p_reason), NULL, p_idempotency_key
        );
      END;
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_manual_cash_movement(p_movement_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
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
        -- Operations born elsewhere are voided at their source (Transaccionar, Cartera, Transferencias).
        IF v_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL') THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_VOIDABLE';
        END IF;
        RETURN reverse_cash_movement(p_movement_id, p_user_id, trim(p_reason));
      END;
      $fn$;
    `);

    // --- 8. Operational day + cuts ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_bank_balances_snapshot()
      RETURNS JSONB
      LANGUAGE sql STABLE
      AS $fn$
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
          'bankId', b.id, 'bankName', b.name, 'accountNumber', b.account_number,
          'specialAccount', b.special_account,
          'balance', CASE WHEN b.special_account = 'GUAYACAN' THEN guayacan_cash_balance() ELSE b.final_balance END
        ) ORDER BY b.name), '[]'::jsonb)
        FROM banks b WHERE b.is_active
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION open_cash_operational_day(
        p_date DATE, p_user_id UUID, p_manual_physical NUMERIC, p_reason VARCHAR,
        p_first_start TIME, p_first_end TIME, p_second_start TIME, p_second_end TIME
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_existing UUID;
        v_prev_day cash_operational_days%ROWTYPE;
        v_last_cut cash_cut_periods%ROWTYPE;
        v_opening_sequence BIGINT;
        v_opening_system NUMERIC(14,2);
        v_physical NUMERIC(14,2);
        v_policy VARCHAR;
        v_prev_physical NUMERIC(14,2);
        v_prev_system NUMERIC(14,2);
        v_first_start TIME := p_first_start;
        v_first_end TIME := p_first_end;
        v_second_start TIME := p_second_start;
        v_second_end TIME := p_second_end;
        v_day_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));

        SELECT id INTO v_existing FROM cash_operational_days WHERE operational_date = p_date;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF EXISTS (SELECT 1 FROM cash_operational_days WHERE operational_date > p_date) THEN
          RAISE EXCEPTION 'CASH_DAY_LATER_EXISTS';
        END IF;
        IF EXISTS (SELECT 1 FROM cash_cut_periods WHERE status = 'ABIERTO') THEN
          RAISE EXCEPTION 'CASH_CUT_ANOTHER_OPEN';
        END IF;

        SELECT * INTO v_prev_day FROM cash_operational_days
        WHERE operational_date < p_date ORDER BY operational_date DESC LIMIT 1;

        -- Schedule: explicit, else the previous day's, else 07:00–13:00 / 13:00–19:00.
        IF v_first_start IS NULL OR v_first_end IS NULL OR v_second_start IS NULL OR v_second_end IS NULL THEN
          IF v_prev_day.id IS NOT NULL THEN
            SELECT (p1.scheduled_start_at AT TIME ZONE 'America/Guatemala')::time,
                   (p1.scheduled_end_at AT TIME ZONE 'America/Guatemala')::time,
                   (p2.scheduled_start_at AT TIME ZONE 'America/Guatemala')::time,
                   (p2.scheduled_end_at AT TIME ZONE 'America/Guatemala')::time
            INTO v_first_start, v_first_end, v_second_start, v_second_end
            FROM cash_cut_periods p1
            JOIN cash_cut_periods p2 ON p2.operational_day_id = p1.operational_day_id AND p2.period_number = 2
            WHERE p1.operational_day_id = v_prev_day.id AND p1.period_number = 1;
          END IF;
          v_first_start := COALESCE(p_first_start, v_first_start, '07:00');
          v_first_end := COALESCE(p_first_end, v_first_end, '13:00');
          v_second_start := COALESCE(p_second_start, v_second_start, '13:00');
          v_second_end := COALESCE(p_second_end, v_second_end, '19:00');
        END IF;
        IF v_first_end <= v_first_start OR v_second_end <= v_second_start THEN
          RAISE EXCEPTION 'CASH_CUT_INVALID_SCHEDULE';
        END IF;
        IF v_second_start < v_first_end THEN
          RAISE EXCEPTION 'CASH_CUT_SCHEDULE_OVERLAP';
        END IF;

        SELECT * INTO v_last_cut FROM cash_cut_periods
        WHERE status = 'FINALIZADO' ORDER BY closing_sequence DESC, actual_finished_at DESC LIMIT 1;

        v_opening_sequence := COALESCE(
          v_last_cut.closing_sequence,
          (SELECT max(sequence) FROM cash_movements WHERE operational_date < p_date),
          0
        );
        v_opening_system := cash_balance_at(v_opening_sequence);

        IF p_manual_physical IS NOT NULL THEN
          IF p_manual_physical < 0 THEN
            RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
          END IF;
          IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
            RAISE EXCEPTION 'CASH_REASON_REQUIRED';
          END IF;
          v_physical := p_manual_physical;
          v_policy := 'AUTHORIZED_MANUAL';
        ELSIF v_last_cut.id IS NOT NULL THEN
          v_physical := v_last_cut.closing_physical_cash;
          v_policy := CASE WHEN v_prev_day.status = 'CERRADO' THEN 'INHERITED_FROM_CLOSE' ELSE 'INHERITED_FROM_LAST_CUT' END;
        ELSE
          -- Nothing was ever counted: open with the Kardex balance, flagged as unverified.
          v_physical := v_opening_system;
          v_policy := 'SYSTEM_UNVERIFIED';
        END IF;

        IF v_prev_day.status = 'CERRADO' THEN
          v_prev_physical := v_prev_day.closing_physical_cash;
          v_prev_system := v_prev_day.closing_system_cash;
        ELSIF v_last_cut.id IS NOT NULL THEN
          v_prev_physical := v_last_cut.closing_physical_cash;
          v_prev_system := v_last_cut.closing_system_cash;
        END IF;

        INSERT INTO cash_operational_days (
          operational_date, status, opening_policy, previous_day_id, previous_cut_id,
          previous_closing_physical_cash, previous_closing_system_cash, inherited_difference,
          opening_sequence, opening_system_cash, opening_physical_cash, opening_reason, opened_by
        ) VALUES (
          p_date, 'ABIERTO', v_policy, v_prev_day.id, v_last_cut.id,
          v_prev_physical, v_prev_system, v_physical - v_opening_system,
          v_opening_sequence, v_opening_system, v_physical, NULLIF(trim(p_reason), ''), p_user_id
        )
        RETURNING id INTO v_day_id;

        INSERT INTO cash_cut_periods (operational_day_id, period_number, scheduled_start_at, scheduled_end_at)
        VALUES
          (v_day_id, 1, cash_guatemala_ts(p_date, v_first_start), cash_guatemala_ts(p_date, v_first_end)),
          (v_day_id, 2, cash_guatemala_ts(p_date, v_second_start), cash_guatemala_ts(p_date, v_second_end));

        RETURN v_day_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_cash_cut_schedule(
        p_period_id UUID, p_start TIME, p_end TIME, p_reason VARCHAR, p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_period cash_cut_periods%ROWTYPE;
        v_sibling cash_cut_periods%ROWTYPE;
        v_date DATE;
        v_new_start TIMESTAMPTZ;
        v_new_end TIMESTAMPTZ;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT * INTO v_period FROM cash_cut_periods WHERE id = p_period_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_FOUND';
        END IF;
        IF v_period.status = 'FINALIZADO' THEN
          RAISE EXCEPTION 'CASH_CUT_ALREADY_FINISHED';
        END IF;
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        IF p_start IS NULL OR p_end IS NULL OR p_end <= p_start THEN
          RAISE EXCEPTION 'CASH_CUT_INVALID_SCHEDULE';
        END IF;

        SELECT operational_date INTO v_date FROM cash_operational_days WHERE id = v_period.operational_day_id;
        v_new_start := cash_guatemala_ts(v_date, p_start);
        v_new_end := cash_guatemala_ts(v_date, p_end);

        SELECT * INTO v_sibling FROM cash_cut_periods
        WHERE operational_day_id = v_period.operational_day_id AND id <> v_period.id;
        IF (v_period.period_number = 1 AND v_new_end > v_sibling.scheduled_start_at)
           OR (v_period.period_number = 2 AND v_new_start < v_sibling.scheduled_end_at) THEN
          RAISE EXCEPTION 'CASH_CUT_SCHEDULE_OVERLAP';
        END IF;

        INSERT INTO cash_cut_schedule_changes (
          cut_period_id, previous_start_at, previous_end_at, new_start_at, new_end_at, reason, changed_by
        ) VALUES (
          v_period.id, v_period.scheduled_start_at, v_period.scheduled_end_at, v_new_start, v_new_end,
          left(trim(p_reason), 255), p_user_id
        );
        UPDATE cash_cut_periods SET scheduled_start_at = v_new_start, scheduled_end_at = v_new_end
        WHERE id = v_period.id;
        RETURN v_period.id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION start_cash_cut_period(p_period_id UUID, p_user_id UUID)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_period cash_cut_periods%ROWTYPE;
        v_first cash_cut_periods%ROWTYPE;
        v_day cash_operational_days%ROWTYPE;
        v_start_sequence BIGINT;
        v_opening_system NUMERIC(14,2);
        v_opening_physical NUMERIC(14,2);
        v_inherited NUMERIC(14,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT * INTO v_period FROM cash_cut_periods WHERE id = p_period_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_FOUND';
        END IF;
        IF v_period.status = 'ABIERTO' THEN
          RAISE EXCEPTION 'CASH_CUT_ALREADY_STARTED';
        END IF;
        IF v_period.status = 'FINALIZADO' THEN
          RAISE EXCEPTION 'CASH_CUT_ALREADY_FINISHED';
        END IF;
        SELECT * INTO v_day FROM cash_operational_days WHERE id = v_period.operational_day_id;
        IF v_day.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'CASH_DAY_ALREADY_CLOSED';
        END IF;
        IF EXISTS (SELECT 1 FROM cash_cut_periods WHERE status = 'ABIERTO') THEN
          RAISE EXCEPTION 'CASH_CUT_ANOTHER_OPEN';
        END IF;

        IF v_period.period_number = 1 THEN
          v_start_sequence := v_day.opening_sequence;
          v_opening_system := v_day.opening_system_cash;
          v_opening_physical := v_day.opening_physical_cash;
          v_inherited := v_day.inherited_difference;
        ELSE
          SELECT * INTO v_first FROM cash_cut_periods
          WHERE operational_day_id = v_period.operational_day_id AND period_number = 1;
          IF v_first.status <> 'FINALIZADO' THEN
            RAISE EXCEPTION 'CASH_CUT_FIRST_NOT_FINISHED';
          END IF;
          -- Second cut inherits the COUNTED cash of the first; the first's difference stays on record.
          v_start_sequence := v_first.closing_sequence;
          v_opening_system := v_first.closing_system_cash;
          v_opening_physical := v_first.closing_physical_cash;
          v_inherited := v_first.cash_difference;
        END IF;

        UPDATE cash_cut_periods
        SET status = 'ABIERTO', actual_started_at = now(), opened_by = p_user_id,
            start_sequence = v_start_sequence, opening_system_cash = v_opening_system,
            opening_physical_cash = v_opening_physical, inherited_difference = v_inherited,
            opening_bank_balances = cash_bank_balances_snapshot()
        WHERE id = v_period.id;

        INSERT INTO cash_cut_events (cut_period_id, action, performed_by, snapshot)
        VALUES (v_period.id, 'INICIADO', p_user_id, jsonb_build_object(
          'startSequence', v_start_sequence, 'openingSystemCash', v_opening_system,
          'openingPhysicalCash', v_opening_physical, 'inheritedDifference', v_inherited
        ));
        RETURN v_period.id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION finish_cash_cut_period(
        p_period_id UUID, p_user_id UUID, p_details JSONB, p_banks JSONB,
        p_cash_observations VARCHAR, p_observations VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_period cash_cut_periods%ROWTYPE;
        v_closing_sequence BIGINT;
        v_system NUMERIC(14,2);
        v_counted NUMERIC(14,2) := 0;
        v_in NUMERIC(14,2);
        v_out NUMERIC(14,2);
        v_movements INT;
        v_count_id UUID;
        v_row RECORD;
        v_bank RECORD;
        v_active_banks INT;
        v_reconciled INT := 0;
        v_bank_system NUMERIC(14,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT * INTO v_period FROM cash_cut_periods WHERE id = p_period_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_FOUND';
        END IF;
        IF v_period.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_OPEN';
        END IF;
        IF p_details IS NULL OR jsonb_typeof(p_details) <> 'array' THEN
          RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
        END IF;

        v_closing_sequence := GREATEST(COALESCE((SELECT max(sequence) FROM cash_movements), 0), v_period.start_sequence);
        v_system := cash_balance();
        SELECT COALESCE(SUM(amount) FILTER (WHERE direction = 'IN'), 0),
               COALESCE(SUM(amount) FILTER (WHERE direction = 'OUT'), 0),
               count(*)
        INTO v_in, v_out, v_movements
        FROM cash_movements
        WHERE sequence > v_period.start_sequence AND sequence <= v_closing_sequence;

        UPDATE cash_cut_counts SET is_current = false WHERE cut_period_id = v_period.id AND is_current;
        INSERT INTO cash_cut_counts (cut_period_id, total_counted, system_cash, difference, observations, created_by)
        VALUES (v_period.id, 0, v_system, -v_system, NULLIF(trim(p_cash_observations), ''), p_user_id)
        RETURNING id INTO v_count_id;

        FOR v_row IN
          SELECT (d->>'denomination')::numeric AS denomination, (d->>'quantity')::numeric AS quantity
          FROM jsonb_array_elements(p_details) d
        LOOP
          IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
             OR v_row.quantity IS NULL OR v_row.quantity < 0 OR v_row.quantity <> trunc(v_row.quantity) THEN
            RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
          END IF;
          BEGIN
            INSERT INTO cash_cut_count_details (count_id, denomination, quantity, subtotal)
            VALUES (v_count_id, v_row.denomination, v_row.quantity::int, v_row.denomination * v_row.quantity);
          EXCEPTION WHEN unique_violation THEN
            RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
          END;
          v_counted := v_counted + v_row.denomination * v_row.quantity;
        END LOOP;

        UPDATE cash_cut_counts SET total_counted = v_counted, difference = v_counted - v_system
        WHERE id = v_count_id;

        SELECT count(*) INTO v_active_banks FROM banks WHERE is_active;
        IF p_banks IS NOT NULL AND jsonb_typeof(p_banks) = 'array' THEN
          FOR v_bank IN
            SELECT (b->>'bankId')::uuid AS bank_id, (b->>'verifiedBalance')::numeric AS verified,
                   NULLIF(trim(b->>'observations'), '') AS observations
            FROM jsonb_array_elements(p_banks) b
          LOOP
            SELECT CASE WHEN special_account = 'GUAYACAN' THEN guayacan_cash_balance() ELSE final_balance END
            INTO v_bank_system FROM banks WHERE id = v_bank.bank_id AND is_active;
            IF NOT FOUND OR v_bank.verified IS NULL THEN
              RAISE EXCEPTION 'CASH_CUT_INVALID_BANK';
            END IF;
            BEGIN
              INSERT INTO cash_cut_bank_reconciliations (
                cut_period_id, count_id, bank_id, bank_name, system_balance, verified_balance,
                difference, observations, created_by
              )
              SELECT v_period.id, v_count_id, b.id, b.name, v_bank_system, v_bank.verified,
                     v_bank.verified - v_bank_system, left(v_bank.observations, 500), p_user_id
              FROM banks b WHERE b.id = v_bank.bank_id;
            EXCEPTION WHEN unique_violation THEN
              RAISE EXCEPTION 'CASH_CUT_INVALID_BANK';
            END;
            v_reconciled := v_reconciled + 1;
          END LOOP;
        END IF;
        IF v_reconciled <> v_active_banks THEN
          RAISE EXCEPTION 'CASH_CUT_BANKS_INCOMPLETE';
        END IF;

        UPDATE cash_cut_periods
        SET status = 'FINALIZADO', actual_finished_at = now(), closed_by = p_user_id,
            closing_sequence = v_closing_sequence, closing_system_cash = v_system,
            closing_physical_cash = v_counted, cash_difference = v_counted - v_system,
            total_in = v_in, total_out = v_out, movement_count = v_movements,
            observations = NULLIF(left(trim(p_observations), 500), '')
        WHERE id = v_period.id;

        INSERT INTO cash_cut_events (cut_period_id, action, performed_by, snapshot)
        VALUES (v_period.id, 'FINALIZADO', p_user_id, jsonb_build_object(
          'countId', v_count_id, 'closingSequence', v_closing_sequence, 'closingSystemCash', v_system,
          'closingPhysicalCash', v_counted, 'cashDifference', v_counted - v_system,
          'totalIn', v_in, 'totalOut', v_out, 'movementCount', v_movements
        ));
        RETURN v_period.id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reopen_cash_cut_period(p_period_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_period cash_cut_periods%ROWTYPE;
        v_day cash_operational_days%ROWTYPE;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_period FROM cash_cut_periods WHERE id = p_period_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_FOUND';
        END IF;
        IF v_period.status <> 'FINALIZADO' THEN
          RAISE EXCEPTION 'CASH_CUT_NOT_FINISHED';
        END IF;
        SELECT * INTO v_day FROM cash_operational_days WHERE id = v_period.operational_day_id;
        IF v_day.status = 'CERRADO' THEN
          RAISE EXCEPTION 'CASH_DAY_ALREADY_CLOSED';
        END IF;
        IF EXISTS (SELECT 1 FROM cash_cut_periods WHERE status = 'ABIERTO') THEN
          RAISE EXCEPTION 'CASH_CUT_ANOTHER_OPEN';
        END IF;
        -- Only the latest cut can be reopened: nothing may have inherited from it yet.
        IF EXISTS (
          SELECT 1 FROM cash_cut_periods
          WHERE operational_day_id = v_period.operational_day_id AND period_number > v_period.period_number
            AND status <> 'PROGRAMADO'
        ) OR EXISTS (
          SELECT 1 FROM cash_operational_days WHERE operational_date > v_day.operational_date
        ) THEN
          RAISE EXCEPTION 'CASH_CUT_LATER_EXISTS';
        END IF;

        INSERT INTO cash_cut_events (cut_period_id, action, reason, performed_by, snapshot)
        VALUES (v_period.id, 'REABIERTO', left(trim(p_reason), 255), p_user_id, to_jsonb(v_period));

        UPDATE cash_cut_counts SET is_current = false WHERE cut_period_id = v_period.id AND is_current;
        UPDATE cash_cut_periods
        SET status = 'ABIERTO', actual_finished_at = NULL, closed_by = NULL, closing_sequence = NULL,
            closing_system_cash = NULL, closing_physical_cash = NULL, cash_difference = NULL,
            total_in = NULL, total_out = NULL, movement_count = NULL,
            reopened_count = reopened_count + 1
        WHERE id = v_period.id;
        RETURN v_period.id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_cash_operational_day(p_day_id UUID, p_user_id UUID, p_observations VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day cash_operational_days%ROWTYPE;
        v_second cash_cut_periods%ROWTYPE;
        v_in NUMERIC(14,2);
        v_out NUMERIC(14,2);
        v_movements INT;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT * INTO v_day FROM cash_operational_days WHERE id = p_day_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_DAY_NOT_FOUND';
        END IF;
        IF v_day.status = 'CERRADO' THEN
          RAISE EXCEPTION 'CASH_DAY_ALREADY_CLOSED';
        END IF;
        IF EXISTS (
          SELECT 1 FROM cash_cut_periods WHERE operational_day_id = p_day_id AND status <> 'FINALIZADO'
        ) THEN
          RAISE EXCEPTION 'CASH_DAY_CUTS_PENDING';
        END IF;
        SELECT * INTO v_second FROM cash_cut_periods WHERE operational_day_id = p_day_id AND period_number = 2;

        -- Consolidated over both cuts' contiguous ranges: each movement counted once.
        SELECT COALESCE(SUM(amount) FILTER (WHERE direction = 'IN'), 0),
               COALESCE(SUM(amount) FILTER (WHERE direction = 'OUT'), 0),
               count(*)
        INTO v_in, v_out, v_movements
        FROM cash_movements
        WHERE sequence > v_day.opening_sequence AND sequence <= v_second.closing_sequence;

        UPDATE cash_operational_days
        SET status = 'CERRADO', closed_by = p_user_id, closed_at = now(),
            closing_sequence = v_second.closing_sequence, closing_system_cash = v_second.closing_system_cash,
            closing_physical_cash = v_second.closing_physical_cash, closing_difference = v_second.cash_difference,
            total_in = v_in, total_out = v_out, movement_count = v_movements,
            closing_observations = NULLIF(left(trim(p_observations), 500), '')
        WHERE id = p_day_id;
        RETURN p_day_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_deposit_insert ON bank_deposit_operations`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_deposit_void ON bank_deposit_operations`,
    );
    for (const table of ['accounts_receivable', 'assets']) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_cash_${table}_insert ON ${table}`,
      );
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_cash_${table}_update ON ${table}`,
      );
    }
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_movement_insert ON bank_account_movements`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_movement_void ON bank_account_movements`,
    );
    for (const fn of [
      'cash_on_bank_deposit_insert()',
      'cash_on_bank_deposit_void()',
      'cash_on_portfolio_row()',
      'cash_on_bank_movement_insert()',
      'cash_on_bank_movement_void()',
      'close_cash_operational_day(UUID, UUID, VARCHAR)',
      'reopen_cash_cut_period(UUID, UUID, VARCHAR)',
      'finish_cash_cut_period(UUID, UUID, JSONB, JSONB, VARCHAR, VARCHAR)',
      'start_cash_cut_period(UUID, UUID)',
      'update_cash_cut_schedule(UUID, TIME, TIME, VARCHAR, UUID)',
      'open_cash_operational_day(DATE, UUID, NUMERIC, VARCHAR, TIME, TIME, TIME, TIME)',
      'cash_bank_balances_snapshot()',
      'void_manual_cash_movement(UUID, UUID, VARCHAR)',
      'register_manual_cash_movement(VARCHAR, NUMERIC, UUID, VARCHAR, VARCHAR, VARCHAR)',
      'reverse_cash_movements_for_reference(VARCHAR, UUID, UUID, VARCHAR)',
      'reverse_cash_movement(UUID, UUID, VARCHAR)',
      'apply_cash_movement(VARCHAR, VARCHAR, NUMERIC, UUID, VARCHAR, VARCHAR, UUID, VARCHAR, VARCHAR, UUID, VARCHAR)',
    ]) {
      await queryRunner.query(`DROP FUNCTION IF EXISTS ${fn}`);
    }
    // Tables, `transaction_types.cash_effect` and every Kardex row are kept on purpose.
  }
}
