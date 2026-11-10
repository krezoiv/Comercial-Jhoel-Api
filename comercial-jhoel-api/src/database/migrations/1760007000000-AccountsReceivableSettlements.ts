import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cuentas por Cobrar → "Cancelar cuenta(s)": collect one or several CARGO
 * rows of the SAME client in one atomic operation, paid in cash or by a
 * deposit into one of the registered bank accounts.
 *
 * Model (reuses the existing Kardex, adds only what was missing):
 * - `account_receivable_payment_operations` — the consolidated payment
 *   (client, method, bank, deposit reference, total, status, cut/day).
 * - `account_receivable_payment_details` — one row per CARGO paid
 *   (amount, pending before/after): each account keeps its own history.
 * - The money itself is ONE consolidated `ABONO` row in `accounts_receivable`
 *   (reference `AR_PAYMENT` → operation), so the client's balance, the
 *   statement, Cuadre de Agentes and reports keep working unchanged.
 * - Cash: that ABONO fires the existing `cash_on_portfolio_row` trigger
 *   (ABONO_POR_COBRAR, IN) — no second cash writer. Bank deposit: the
 *   trigger now skips ABONOs of a `DEPOSITO_BANCARIO` operation (a deposit
 *   is never physical cash) and the account goes up through the single bank
 *   writer `apply_bank_account_movement` (type `COBRO_CXC`, origin
 *   `CUENTAS_POR_COBRAR`).
 *
 * Pending per CARGO (`ar_charge_balances`): its amount − the payments
 * allocated to it − its FIFO share of the client's general (unallocated)
 * ABONOs, i.e. the abonos registered with "Registrar Abono" before/after this
 * feature. The sum of the pendings is therefore always the client's balance.
 *
 * Concurrency: lock order bank row → cash lock → client lock (the same order
 * Transaccionar uses) and the CARGO rows are locked FOR UPDATE; a
 * per-request advisory lock + UNIQUE idempotency key make retries return the
 * same operation. A guard trigger blocks editing/deactivating the
 * operation's ABONO, or a CARGO that already has payments, outside the void.
 *
 * `down` drops the new functions/triggers and restores the previous cash
 * trigger body; tables, constraints and rows are kept on purpose.
 */
export class AccountsReceivableSettlements1760007000000 implements MigrationInterface {
  name = 'AccountsReceivableSettlements1760007000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_account_movements
        DROP CONSTRAINT IF EXISTS "CHK_bank_account_movements_type",
        ADD CONSTRAINT "CHK_bank_account_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO',
          'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'RETIRO_EFECTIVO', 'AJUSTE_MANUAL',
          'SALDO_INICIAL', 'ANULACION', 'ACREDITACION_SALDO', 'DEPOSITO_CAJA', 'COBRO_CXC'
        )),
        DROP CONSTRAINT IF EXISTS "CHK_bank_account_movements_origin",
        ADD CONSTRAINT "CHK_bank_account_movements_origin" CHECK (origin IN (
          'TRANSACCIONAR', 'TRANSFERENCIA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION',
          'ACREDITACION_SALDO', 'CONTROL_EFECTIVO', 'CUENTAS_POR_COBRAR'
        ))
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS account_receivable_payment_operations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
        payment_method VARCHAR(20) NOT NULL,
        bank_id UUID NULL REFERENCES banks(id) ON DELETE RESTRICT,
        reference_number VARCHAR(100) NULL,
        total_amount NUMERIC(14,2) NOT NULL,
        accounts_count INT NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO',
        observations VARCHAR(500) NULL,
        abono_id UUID NULL REFERENCES accounts_receivable(id) ON DELETE RESTRICT,
        cash_movement_id UUID NULL REFERENCES cash_movements(id) ON DELETE RESTRICT,
        bank_movement_id UUID NULL REFERENCES bank_account_movements(id) ON DELETE RESTRICT,
        operational_day_id UUID NULL REFERENCES cash_operational_days(id) ON DELETE RESTRICT,
        cut_period_id UUID NULL REFERENCES cash_cut_periods(id) ON DELETE RESTRICT,
        idempotency_key VARCHAR(150) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        CONSTRAINT "UQ_ar_payment_operations_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "CHK_ar_payment_operations_method" CHECK (payment_method IN ('EFECTIVO', 'DEPOSITO_BANCARIO')),
        CONSTRAINT "CHK_ar_payment_operations_bank" CHECK ((payment_method = 'DEPOSITO_BANCARIO') = (bank_id IS NOT NULL)),
        CONSTRAINT "CHK_ar_payment_operations_total" CHECK (total_amount > 0),
        CONSTRAINT "CHK_ar_payment_operations_count" CHECK (accounts_count > 0),
        CONSTRAINT "CHK_ar_payment_operations_status" CHECK (status IN ('APLICADO', 'ANULADO')),
        CONSTRAINT "CHK_ar_payment_operations_void" CHECK (
          (status = 'APLICADO' AND voided_at IS NULL AND voided_by IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ar_payment_operations_client" ON account_receivable_payment_operations (client_id, created_at DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ar_payment_operations_created" ON account_receivable_payment_operations (created_at DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ar_payment_operations_bank" ON account_receivable_payment_operations (bank_id) WHERE bank_id IS NOT NULL`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS account_receivable_payment_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        payment_operation_id UUID NOT NULL REFERENCES account_receivable_payment_operations(id) ON DELETE RESTRICT,
        account_receivable_id UUID NOT NULL REFERENCES accounts_receivable(id) ON DELETE RESTRICT,
        amount_paid NUMERIC(14,2) NOT NULL,
        previous_balance NUMERIC(14,2) NOT NULL,
        new_balance NUMERIC(14,2) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_ar_payment_details_account" UNIQUE (payment_operation_id, account_receivable_id),
        CONSTRAINT "CHK_ar_payment_details_amount" CHECK (amount_paid > 0),
        CONSTRAINT "CHK_ar_payment_details_balance" CHECK (
          previous_balance >= amount_paid AND new_balance = previous_balance - amount_paid
        )
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ar_payment_details_account" ON account_receivable_payment_details (account_receivable_id)`,
    );

    // Pending per CARGO — see the class doc comment. Inactive rows never count.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ar_charge_balances(p_client_ids UUID[])
      RETURNS TABLE (
        charge_id UUID,
        client_id UUID,
        original_amount NUMERIC(14,2),
        allocated_paid NUMERIC(14,2),
        general_applied NUMERIC(14,2),
        pending NUMERIC(14,2)
      )
      LANGUAGE sql
      STABLE
      AS $fn$
        WITH charges AS (
          SELECT ar.id, ar.client_id, ar.amount, ar.sequence,
                 COALESCE((
                   SELECT sum(d.amount_paid)
                   FROM account_receivable_payment_details d
                   JOIN account_receivable_payment_operations o
                     ON o.id = d.payment_operation_id AND o.status = 'APLICADO'
                   WHERE d.account_receivable_id = ar.id
                 ), 0) AS allocated
          FROM accounts_receivable ar
          WHERE ar.client_id = ANY (p_client_ids) AND ar.movement_type = 'CARGO' AND ar.is_active
        ),
        remaining AS (
          SELECT c.*, greatest(c.amount - c.allocated, 0) AS rem,
                 COALESCE(sum(greatest(c.amount - c.allocated, 0)) OVER (
                   PARTITION BY c.client_id ORDER BY c.sequence
                   ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
                 ), 0) AS rem_before
          FROM charges c
        ),
        pool AS (
          SELECT ar.client_id, sum(ar.amount) AS general
          FROM accounts_receivable ar
          WHERE ar.client_id = ANY (p_client_ids) AND ar.movement_type = 'ABONO' AND ar.is_active
            AND ar.reference_type IS DISTINCT FROM 'AR_PAYMENT'
          GROUP BY ar.client_id
        )
        SELECT r.id, r.client_id, r.amount, r.allocated,
               least(r.rem, greatest(COALESCE(p.general, 0) - r.rem_before, 0)),
               r.rem - least(r.rem, greatest(COALESCE(p.general, 0) - r.rem_before, 0))
        FROM remaining r
        LEFT JOIN pool p ON p.client_id = r.client_id
      $fn$;
    `);

    await queryRunner.query(cashOnPortfolioRowSql(true));

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ar_payment_guard()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_paid NUMERIC(14,2);
      BEGIN
        IF current_setting('app.ar_payment_write', true) = 'on' THEN
          RETURN NEW;
        END IF;
        IF OLD.reference_type = 'AR_PAYMENT' AND (
          NEW.amount <> OLD.amount OR NEW.is_active <> OLD.is_active OR NEW.client_id <> OLD.client_id
          OR NEW.movement_type <> OLD.movement_type
          OR NEW.reference_type IS DISTINCT FROM OLD.reference_type
          OR NEW.reference_id IS DISTINCT FROM OLD.reference_id
        ) THEN
          RAISE EXCEPTION 'AR_PAYMENT_ROW_LOCKED';
        END IF;
        IF OLD.movement_type = 'CARGO' THEN
          SELECT COALESCE(sum(d.amount_paid), 0) INTO v_paid
          FROM account_receivable_payment_details d
          JOIN account_receivable_payment_operations o
            ON o.id = d.payment_operation_id AND o.status = 'APLICADO'
          WHERE d.account_receivable_id = OLD.id;
          IF v_paid > 0 AND (
            NOT NEW.is_active OR NEW.client_id <> OLD.client_id
            OR NEW.movement_type <> 'CARGO' OR NEW.amount < v_paid
          ) THEN
            RAISE EXCEPTION 'AR_CHARGE_HAS_PAYMENTS';
          END IF;
        END IF;
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_ar_payment_guard ON accounts_receivable`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_ar_payment_guard
        BEFORE UPDATE ON accounts_receivable
        FOR EACH ROW EXECUTE FUNCTION ar_payment_guard()
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION settle_accounts_receivable(
        p_client_id UUID,
        p_items JSONB,
        p_payment_method VARCHAR,
        p_bank_id UUID,
        p_reference_number VARCHAR,
        p_observations VARCHAR,
        p_expected_total NUMERIC,
        p_user_id UUID,
        p_idempotency_key VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_existing RECORD;
        v_operation_id UUID := gen_random_uuid();
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
        v_bank RECORD;
        v_bank_name VARCHAR;
        v_client_name VARCHAR;
        v_count INT;
        v_line RECORD;
        v_row RECORD;
        v_amount NUMERIC(14,2);
        v_total NUMERIC(14,2) := 0;
        v_lines JSONB := '[]'::jsonb;
        v_abono_id UUID;
        v_cash_id UUID;
        v_bank_movement_id UUID;
        v_day_id UUID;
        v_period_id UUID;
        v_reference VARCHAR := NULLIF(trim(COALESCE(p_reference_number, '')), '');
        v_observations VARCHAR := NULLIF(trim(COALESCE(p_observations, '')), '');
        v_description VARCHAR;
      BEGIN
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        -- Serializes retries of the SAME request only.
        PERFORM pg_advisory_xact_lock(hashtext('ar_settlement:' || p_idempotency_key));
        SELECT id, client_id INTO v_existing
        FROM account_receivable_payment_operations WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          IF v_existing.client_id <> p_client_id THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_IDEMPOTENCY_CONFLICT';
          END IF;
          RETURN v_existing.id;
        END IF;

        IF p_payment_method IS NULL OR p_payment_method NOT IN ('EFECTIVO', 'DEPOSITO_BANCARIO') THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_INVALID_METHOD';
        END IF;
        SELECT name INTO v_client_name FROM clients WHERE id = p_client_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_CLIENT_NOT_FOUND';
        END IF;
        IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_ITEMS_REQUIRED';
        END IF;
        v_count := jsonb_array_length(p_items);
        IF v_count > 200 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_TOO_MANY_ITEMS';
        END IF;
        IF (SELECT count(DISTINCT e->>'id') FROM jsonb_array_elements(p_items) e) <> v_count THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_DUPLICATE_ITEM';
        END IF;

        -- Lock order: bank row → cash → client (same as Transaccionar).
        IF p_payment_method = 'DEPOSITO_BANCARIO' THEN
          IF p_bank_id IS NULL THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_BANK_REQUIRED';
          END IF;
          SELECT id, name, account_number, special_account, is_active INTO v_bank
          FROM banks WHERE id = p_bank_id FOR UPDATE;
          IF NOT FOUND OR NOT v_bank.is_active THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_INVALID_BANK';
          END IF;
          IF v_bank.special_account = 'GUAYACAN' THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED';
          END IF;
          v_bank_name := v_bank.name;
        ELSIF p_bank_id IS NOT NULL OR v_reference IS NOT NULL THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_BANK_NOT_ALLOWED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));

        -- Lock every selected row, then validate it against the pendings computed in SQL.
        FOR v_line IN
          SELECT e.ord, (e.value->>'id')::uuid AS id,
                 NULLIF(e.value->>'amount', '')::numeric AS amount
          FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, ord)
          ORDER BY e.ord
        LOOP
          SELECT id, client_id, movement_type, is_active INTO v_row
          FROM accounts_receivable WHERE id = v_line.id FOR UPDATE;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_ACCOUNT_NOT_FOUND';
          END IF;
          IF v_row.client_id <> p_client_id THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_MIXED_CLIENTS';
          END IF;
          IF v_row.movement_type <> 'CARGO' OR NOT v_row.is_active THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE';
          END IF;
        END LOOP;

        FOR v_line IN
          SELECT e.ord, (e.value->>'id')::uuid AS id,
                 NULLIF(e.value->>'amount', '')::numeric AS amount, b.pending
          FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, ord)
          JOIN ar_charge_balances(ARRAY[p_client_id]) b ON b.charge_id = (e.value->>'id')::uuid
          ORDER BY e.ord
        LOOP
          IF v_line.pending <= 0 THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_ALREADY_SETTLED';
          END IF;
          IF v_line.amount IS NULL THEN
            v_amount := v_line.pending;
          ELSE
            -- Partial payments only for a single account: never an accidental partial in a batch.
            IF v_count > 1 AND v_line.amount <> v_line.pending THEN
              RAISE EXCEPTION 'AR_SETTLEMENT_PARTIAL_NOT_ALLOWED';
            END IF;
            IF v_line.amount <= 0 OR v_line.amount <> round(v_line.amount, 2) THEN
              RAISE EXCEPTION 'AR_SETTLEMENT_INVALID_AMOUNT';
            END IF;
            IF v_line.amount > v_line.pending THEN
              RAISE EXCEPTION 'AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING';
            END IF;
            v_amount := v_line.amount;
          END IF;
          v_total := v_total + v_amount;
          v_lines := v_lines || jsonb_build_object(
            'id', v_line.id, 'amount', v_amount, 'pending', v_line.pending
          );
        END LOOP;

        IF p_expected_total IS NOT NULL AND round(p_expected_total, 2) <> v_total THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_TOTAL_MISMATCH';
        END IF;

        INSERT INTO account_receivable_payment_operations (
          id, client_id, payment_method, bank_id, reference_number, total_amount, accounts_count,
          observations, idempotency_key, created_by
        ) VALUES (
          v_operation_id, p_client_id, p_payment_method, p_bank_id, left(v_reference, 100), v_total, v_count,
          left(v_observations, 500), p_idempotency_key, p_user_id
        );

        v_description := left(
          'Cancelación de ' || v_count || CASE WHEN v_count = 1 THEN ' cuenta' ELSE ' cuentas' END
          || ' por cobrar'
          || CASE WHEN p_payment_method = 'DEPOSITO_BANCARIO'
               THEN ' — depósito ' || v_bank_name || COALESCE(' ref. ' || v_reference, '')
               ELSE ' — efectivo' END
          || COALESCE(' — ' || v_observations, ''),
          500
        );

        -- One consolidated ABONO (re-checks ABONO_EXCEEDS_BALANCE). For cash, its
        -- insert trigger appends the ABONO_POR_COBRAR entry to the cash Kardex.
        v_abono_id := register_account_receivable_movement(
          p_client_id, 'ABONO', v_total, v_date, v_description, p_user_id, 'AR_PAYMENT', v_operation_id
        );

        IF p_payment_method = 'DEPOSITO_BANCARIO' THEN
          v_bank_movement_id := apply_bank_account_movement(
            p_bank_id, 'COBRO_CXC', 'CUENTAS_POR_COBRAR', v_total, v_date, p_user_id,
            'AR_PAYMENT', v_operation_id, left(v_reference, 100),
            left('Cobro de cuentas por cobrar — ' || v_client_name, 255), v_observations, NULL, NULL
          );
          -- Same day/cut attribution rule as apply_cash_movement.
          SELECT id INTO v_day_id FROM cash_operational_days WHERE operational_date = v_date;
          SELECT id, operational_day_id INTO v_period_id, v_day_id
          FROM (
            SELECT id, operational_day_id, 0 AS rank FROM cash_cut_periods WHERE status = 'ABIERTO'
            UNION ALL
            SELECT id, operational_day_id, period_number FROM cash_cut_periods
            WHERE operational_day_id = v_day_id AND status = 'PROGRAMADO'
          ) candidates
          ORDER BY rank LIMIT 1;
          IF v_period_id IS NULL THEN
            SELECT id INTO v_day_id FROM cash_operational_days WHERE operational_date = v_date;
          END IF;
        ELSE
          SELECT id, operational_day_id, cut_period_id INTO v_cash_id, v_day_id, v_period_id
          FROM cash_movements
          WHERE reference_type = 'ACCOUNT_RECEIVABLE' AND reference_id = v_abono_id
            AND movement_type = 'ABONO_POR_COBRAR'
          ORDER BY sequence DESC LIMIT 1;
          IF v_cash_id IS NULL THEN
            RAISE EXCEPTION 'AR_SETTLEMENT_CASH_NOT_RECORDED';
          END IF;
        END IF;

        INSERT INTO account_receivable_payment_details (
          payment_operation_id, account_receivable_id, amount_paid, previous_balance, new_balance
        )
        SELECT v_operation_id, (l->>'id')::uuid, (l->>'amount')::numeric, (l->>'pending')::numeric,
               (l->>'pending')::numeric - (l->>'amount')::numeric
        FROM jsonb_array_elements(v_lines) l;

        UPDATE account_receivable_payment_operations
        SET abono_id = v_abono_id, cash_movement_id = v_cash_id, bank_movement_id = v_bank_movement_id,
            operational_day_id = v_day_id, cut_period_id = v_period_id
        WHERE id = v_operation_id;

        RETURN v_operation_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_account_receivable_payment(
        p_operation_id UUID, p_user_id UUID, p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_operation account_receivable_payment_operations%ROWTYPE;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_NOT_FOUND';
        END IF;
        -- Same lock order as the settlement.
        IF v_operation.bank_id IS NOT NULL THEN
          PERFORM 1 FROM banks WHERE id = v_operation.bank_id FOR UPDATE;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext(v_operation.client_id::text));
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id FOR UPDATE;
        IF v_operation.status = 'ANULADO' THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_ALREADY_VOIDED';
        END IF;

        -- Deactivating the ABONO restores the accounts' pending; for cash its
        -- update trigger appends the ANULACION (cash OUT) to the Kardex.
        PERFORM set_config('app.ar_payment_write', 'on', true);
        UPDATE accounts_receivable SET is_active = false, updated_by = p_user_id, updated_at = now()
        WHERE id = v_operation.abono_id;
        PERFORM set_config('app.ar_payment_write', 'off', true);

        IF v_operation.payment_method = 'DEPOSITO_BANCARIO' THEN
          PERFORM reverse_bank_account_movements('AR_PAYMENT', p_operation_id, v_date, p_user_id, trim(p_reason));
        END IF;

        UPDATE account_receivable_payment_operations
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = p_operation_id;
        RETURN p_operation_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS void_account_receivable_payment(UUID, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS settle_accounts_receivable(UUID, JSONB, VARCHAR, UUID, VARCHAR, VARCHAR, NUMERIC, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_ar_payment_guard ON accounts_receivable`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS ar_payment_guard()`);
    await queryRunner.query(cashOnPortfolioRowSql(false));
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS ar_charge_balances(UUID[])`,
    );
    // Tables, constraints and rows are kept on purpose (no history is deleted).
  }
}

/**
 * Body of the existing `cash_on_portfolio_row` trigger (migration
 * 1760006800000). `skipBankSettlements` adds the only change: an ABONO of a
 * "Depósito bancario" settlement never enters the physical cash.
 */
function cashOnPortfolioRowSql(skipBankSettlements: boolean): string {
  const skip = skipBankSettlements
    ? `
        -- A collection paid by bank deposit never enters the physical cash.
        IF v_is_receivable AND NEW.reference_type = 'AR_PAYMENT' AND EXISTS (
          SELECT 1 FROM account_receivable_payment_operations
          WHERE id = NEW.reference_id AND payment_method = 'DEPOSITO_BANCARIO'
        ) THEN
          RETURN NEW;
        END IF;
`
    : '';
  return `
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
${skip}
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
    `;
}
