import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Control de Efectivo → "Depósito bancario": cash leaves the caja and is
 * deposited into one of the registered bank accounts.
 *
 * - Bank side: new movement type `DEPOSITO_CAJA` (origin `CONTROL_EFECTIVO`)
 *   applied through `apply_bank_account_movement` — the single writer of
 *   `banks.final_balance` — so the account's own rules still apply (row lock,
 *   active account, `max_balance`, BI Club range). Cooperativa Guayacán is
 *   rejected by its existing guard trigger (its balance is its own caja).
 * - Cash side: new Kardex type `DEPOSITO_BANCARIO` (OUT), same transaction.
 *   Rejected when the official cash is lower than the amount
 *   (`CASH_INSUFFICIENT_BALANCE`).
 * - Mandatory denomination breakdown in the new `cash_movement_details`
 *   (must add up to the amount exactly).
 * - Both sides share one operation id (`reference_id`); voiding (admin,
 *   reason) reverses the bank movement and appends the cash ANULACION. Lock
 *   order is always bank row → cash lock, the same order Transaccionar uses,
 *   so the two flows cannot deadlock. A per-request advisory lock + the
 *   idempotency key make retries return the same deposit.
 *
 * `down` drops only the new functions; tables, constraints and rows stay.
 */
export class CashBankDeposit1760006900000 implements MigrationInterface {
  name = 'CashBankDeposit1760006900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_account_movements
        DROP CONSTRAINT IF EXISTS "CHK_bank_account_movements_type",
        ADD CONSTRAINT "CHK_bank_account_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO',
          'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'RETIRO_EFECTIVO', 'AJUSTE_MANUAL',
          'SALDO_INICIAL', 'ANULACION', 'ACREDITACION_SALDO', 'DEPOSITO_CAJA'
        )),
        DROP CONSTRAINT IF EXISTS "CHK_bank_account_movements_origin",
        ADD CONSTRAINT "CHK_bank_account_movements_origin" CHECK (origin IN (
          'TRANSACCIONAR', 'TRANSFERENCIA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION',
          'ACREDITACION_SALDO', 'CONTROL_EFECTIVO'
        ))
    `);

    await queryRunner.query(`
      ALTER TABLE cash_movements
        DROP CONSTRAINT IF EXISTS "CHK_cash_movements_type",
        ADD CONSTRAINT "CHK_cash_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', 'OTRA_TRANSACCION',
          'GASTO_POR_COBRAR', 'ABONO_POR_COBRAR', 'ACTIVO', 'DEVOLUCION_ACTIVO', 'RETIRO_BANCARIO',
          'ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL', 'ANULACION', 'DEPOSITO_BANCARIO'
        ))
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_movement_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        movement_id UUID NOT NULL REFERENCES cash_movements(id) ON DELETE RESTRICT,
        denomination NUMERIC(6,2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_cash_movement_details" UNIQUE (movement_id, denomination),
        CONSTRAINT "CHK_cash_movement_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_cash_bank_deposit(
        p_bank_id UUID, p_amount NUMERIC, p_details JSONB, p_user_id UUID,
        p_description VARCHAR, p_idempotency_key VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_existing UUID;
        v_operation_id UUID := gen_random_uuid();
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
        v_bank RECORD;
        v_row RECORD;
        v_total NUMERIC(14,2) := 0;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_cash_id UUID;
      BEGIN
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        -- Serializes retries of the SAME request only (no contention with other operations).
        PERFORM pg_advisory_xact_lock(hashtext('cash_bank_deposit:' || p_idempotency_key));
        SELECT id INTO v_existing FROM cash_movements WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;

        SELECT id, name, special_account, is_active INTO v_bank FROM banks WHERE id = p_bank_id;
        IF NOT FOUND OR NOT v_bank.is_active THEN
          RAISE EXCEPTION 'CASH_DEPOSIT_INVALID_BANK';
        END IF;
        IF v_bank.special_account = 'GUAYACAN' THEN
          RAISE EXCEPTION 'CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED';
        END IF;

        -- Mandatory breakdown that adds up to the amount exactly.
        IF p_details IS NULL OR jsonb_typeof(p_details) <> 'array' OR jsonb_array_length(p_details) = 0 THEN
          RAISE EXCEPTION 'CASH_BREAKDOWN_REQUIRED';
        END IF;
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

        -- 1) Bank: + amount (row lock + account rules inside the single writer).
        PERFORM apply_bank_account_movement(
          p_bank_id, 'DEPOSITO_CAJA', 'CONTROL_EFECTIVO', p_amount, v_date, p_user_id,
          'DEPOSITO_CAJA', v_operation_id, NULL, 'Depósito de efectivo desde caja',
          NULLIF(trim(p_description), ''), NULL, NULL
        );

        -- 2) Cash: − amount, checked under the cash lock.
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        IF cash_balance() < p_amount THEN
          RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
        END IF;
        v_cash_id := apply_cash_movement(
          'DEPOSITO_BANCARIO', 'OUT', p_amount, p_user_id,
          left('Depósito bancario — ' || v_bank.name || COALESCE(' — ' || NULLIF(trim(p_description), ''), ''), 255),
          'BANK_CASH_DEPOSIT', v_operation_id, v_bank.name, NULL, NULL, p_idempotency_key
        );

        INSERT INTO cash_movement_details (movement_id, denomination, quantity, subtotal)
        SELECT v_cash_id, (d->>'denomination')::numeric, (d->>'quantity')::int,
               (d->>'denomination')::numeric * (d->>'quantity')::int
        FROM jsonb_array_elements(p_details) d;

        RETURN v_cash_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_cash_bank_deposit(p_movement_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_movement cash_movements%ROWTYPE;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_movement FROM cash_movements WHERE id = p_movement_id;
        IF NOT FOUND OR v_movement.movement_type <> 'DEPOSITO_BANCARIO' THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_FOUND';
        END IF;
        IF v_movement.status = 'ANULADO' THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_ALREADY_VOIDED';
        END IF;
        -- Bank first (row lock), then cash — same lock order as every other flow.
        PERFORM reverse_bank_account_movements('DEPOSITO_CAJA', v_movement.reference_id, v_date, p_user_id, trim(p_reason));
        RETURN reverse_cash_movement(p_movement_id, p_user_id, trim(p_reason));
      END;
      $fn$;
    `);

    // The Kardex void entry point now also handles bank deposits (both sides together).
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
        IF v_type = 'DEPOSITO_BANCARIO' THEN
          RETURN void_cash_bank_deposit(p_movement_id, p_user_id, p_reason);
        END IF;
        IF v_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL') THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_VOIDABLE';
        END IF;
        RETURN reverse_cash_movement(p_movement_id, p_user_id, trim(p_reason));
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_cash_bank_deposit(UUID, NUMERIC, JSONB, UUID, VARCHAR, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS void_cash_bank_deposit(UUID, UUID, VARCHAR)`,
    );
    // void_manual_cash_movement keeps its extended body; tables/constraints/rows are kept on purpose.
  }
}
