import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cooperativa Guayacán — comisión por transacción + Caja (Kardex) propia.
 *
 * 1. `transaction_banks.cash_box_code` ('GUAYACAN') identifica al banco
 *    agente — nunca por nombre en el código — y
 *    `transaction_banks.commission_per_transaction` es la ÚNICA fuente de la
 *    tarifa (Q3.00). Ambas NULL en cualquier otro banco agente: ninguno más
 *    genera comisión. Se marca solo si hay exactamente UN banco agente
 *    activo cuyo nombre normalizado contiene "guayacan" o es "cooperativa";
 *    si no, se marca desde Sistema → Banco Agente (no se adivina).
 * 2. `guayacan_cash_movements`: ledger de la caja (saldo anterior / monto con
 *    signo / saldo posterior, `sequence` estricta). Saldo inicial = 0 (no se
 *    inventa). Tipos: INGRESO, EGRESO, AJUSTE (admin), COMISION_TRANSACCION,
 *    REVERSO_COMISION, ANULACION. Nada se edita ni se borra: anular marca el
 *    original ANULADO y agrega el movimiento inverso (`reversal_of_id`).
 *    `client_request_id` hace idempotente el registro manual (doble clic).
 *    Desglose opcional por movimiento en `guayacan_cash_movement_details`.
 * 3. `guayacan_cash_counts` (+ detalles): arqueos físicos por denominación.
 *    Solo registran conteo vs. saldo del Kardex; NUNCA cambian el saldo —
 *    una diferencia se corrige con un AJUSTE autorizado.
 * 4. Comisión automática por TRIGGER sobre `bank_deposit_operations`
 *    (sin tocar `register_bank_deposit_operation`/`void_bank_deposit_operation`):
 *    - AFTER INSERT: si el banco agente es GUAYACAN → COMISION_TRANSACCION por
 *      `transaction_count × tarifa` (cada transacción distribuida, no por
 *      operación), en la misma transacción SQL: si la operación falla,
 *      la comisión tampoco existe. Índice único por operación = nunca dos.
 *    - AFTER UPDATE (is_voided false → true): REVERSO_COMISION independiente;
 *      la comisión original queda ANULADO, nunca se borra. El reverso puede
 *      dejar la caja en negativo: anular la operación bancaria no se bloquea
 *      por el efectivo de la caja.
 *    La tarifa y la cantidad se guardan en el movimiento: cambiar la tarifa
 *    después no altera comisiones históricas.
 *
 * `down` quita triggers y funciones; conserva tablas y columnas (no se
 * borra información).
 */
export class CreateGuayacanCashBox1760006300000 implements MigrationInterface {
  name = 'CreateGuayacanCashBox1760006300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE transaction_banks
        ADD COLUMN IF NOT EXISTS cash_box_code VARCHAR(30) NULL,
        ADD COLUMN IF NOT EXISTS commission_per_transaction NUMERIC(10,2) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE transaction_banks
        DROP CONSTRAINT IF EXISTS "CHK_transaction_banks_cash_box_code",
        DROP CONSTRAINT IF EXISTS "CHK_transaction_banks_commission",
        ADD CONSTRAINT "CHK_transaction_banks_cash_box_code"
          CHECK (cash_box_code IS NULL OR cash_box_code IN ('GUAYACAN')),
        ADD CONSTRAINT "CHK_transaction_banks_commission"
          CHECK (
            commission_per_transaction IS NULL
            OR (commission_per_transaction > 0 AND cash_box_code IS NOT NULL)
          )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_transaction_banks_cash_box_code"
        ON transaction_banks (cash_box_code) WHERE cash_box_code IS NOT NULL
    `);
    await queryRunner.query(`
      WITH candidates AS (
        SELECT id FROM transaction_banks
        WHERE is_active
          AND (search_normalize(name) LIKE '%guayacan%' OR search_normalize(name) = 'cooperativa')
      )
      UPDATE transaction_banks
      SET cash_box_code = 'GUAYACAN', commission_per_transaction = 3.00
      WHERE id = (SELECT id FROM candidates)
        AND (SELECT count(*) FROM candidates) = 1
        AND NOT EXISTS (SELECT 1 FROM transaction_banks WHERE cash_box_code = 'GUAYACAN')
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guayacan_cash_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL UNIQUE,
        movement_type VARCHAR(30) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        balance_before NUMERIC(14,2) NOT NULL,
        balance_after NUMERIC(14,2) NOT NULL,
        business_date DATE NOT NULL,
        concept VARCHAR(150) NOT NULL,
        reason VARCHAR(255) NULL,
        notes VARCHAR(500) NULL,
        reference_type VARCHAR(30) NULL,
        reference_id UUID NULL,
        transaction_count INT NULL,
        commission_rate NUMERIC(10,2) NULL,
        reversal_of_id UUID NULL REFERENCES guayacan_cash_movements(id) ON DELETE RESTRICT,
        client_request_id UUID NULL,
        status VARCHAR(15) NOT NULL DEFAULT 'VIGENTE',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_guayacan_cash_movements_type" CHECK (movement_type IN (
          'INGRESO', 'EGRESO', 'AJUSTE', 'COMISION_TRANSACCION', 'REVERSO_COMISION', 'ANULACION'
        )),
        CONSTRAINT "CHK_guayacan_cash_movements_amount" CHECK (amount <> 0),
        CONSTRAINT "CHK_guayacan_cash_movements_sign" CHECK (
          (movement_type IN ('INGRESO', 'COMISION_TRANSACCION') AND amount > 0)
          OR (movement_type IN ('EGRESO', 'REVERSO_COMISION') AND amount < 0)
          OR movement_type IN ('AJUSTE', 'ANULACION')
        ),
        CONSTRAINT "CHK_guayacan_cash_movements_balance" CHECK (balance_after = balance_before + amount),
        CONSTRAINT "CHK_guayacan_cash_movements_status" CHECK (status IN ('VIGENTE', 'ANULADO')),
        CONSTRAINT "CHK_guayacan_cash_movements_void" CHECK (
          (status = 'VIGENTE' AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_guayacan_cash_movements_client_request"
        ON guayacan_cash_movements (client_request_id) WHERE client_request_id IS NOT NULL
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_guayacan_cash_movements_commission"
        ON guayacan_cash_movements (reference_type, reference_id) WHERE movement_type = 'COMISION_TRANSACCION'
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_guayacan_cash_movements_reversal"
        ON guayacan_cash_movements (reversal_of_id) WHERE reversal_of_id IS NOT NULL
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_guayacan_cash_movements_business_date"
        ON guayacan_cash_movements (business_date)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guayacan_cash_movement_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        movement_id UUID NOT NULL REFERENCES guayacan_cash_movements(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_guayacan_cash_movement_details" UNIQUE (movement_id, denomination)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guayacan_cash_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL UNIQUE,
        business_date DATE NOT NULL,
        total_counted NUMERIC(14,2) NOT NULL CHECK (total_counted >= 0),
        system_balance NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        notes VARCHAR(500) NULL,
        client_request_id UUID NULL UNIQUE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_guayacan_cash_counts_difference" CHECK (difference = total_counted - system_balance)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guayacan_cash_count_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_id UUID NOT NULL REFERENCES guayacan_cash_counts(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_guayacan_cash_count_details" UNIQUE (count_id, denomination)
      )
    `);

    // Denominaciones del sistema (las mismas de Transaccionar).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_valid_denomination(p_value NUMERIC)
      RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $fn$
        SELECT p_value IN (200, 100, 50, 20, 10, 5, 1, 0.50, 0.25, 0.10, 0.05)
      $fn$;
    `);

    // Único escritor del ledger: lock global de la caja, saldo leído bajo lock.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION apply_guayacan_cash_movement(
        p_movement_type VARCHAR,
        p_amount NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_concept VARCHAR,
        p_reason VARCHAR,
        p_notes VARCHAR,
        p_reference_type VARCHAR,
        p_reference_id UUID,
        p_transaction_count INT,
        p_commission_rate NUMERIC,
        p_reversal_of_id UUID,
        p_client_request_id UUID,
        p_cash_details JSONB,
        p_allow_negative BOOLEAN
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_before NUMERIC(14,2);
        v_after NUMERIC(14,2);
        v_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_breakdown_total NUMERIC(14,2) := 0;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));

        IF p_client_request_id IS NOT NULL THEN
          SELECT id INTO v_id FROM guayacan_cash_movements WHERE client_request_id = p_client_request_id;
          IF FOUND THEN
            RETURN v_id;
          END IF;
        END IF;

        IF p_amount IS NULL OR p_amount = 0 THEN
          RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_AMOUNT';
        END IF;
        IF p_concept IS NULL OR length(trim(p_concept)) = 0 THEN
          RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_CONCEPT';
        END IF;
        IF p_business_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_DATE';
        END IF;

        SELECT balance_after INTO v_before
        FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1;
        v_before := COALESCE(v_before, 0);
        v_after := v_before + p_amount;

        IF v_after < 0 AND p_amount < 0 AND NOT COALESCE(p_allow_negative, false) THEN
          RAISE EXCEPTION 'CASH_BOX_INSUFFICIENT_BALANCE:%', v_before;
        END IF;

        INSERT INTO guayacan_cash_movements (
          movement_type, amount, balance_before, balance_after, business_date,
          concept, reason, notes, reference_type, reference_id, transaction_count,
          commission_rate, reversal_of_id, client_request_id, created_by
        ) VALUES (
          p_movement_type, p_amount, v_before, v_after, p_business_date,
          trim(p_concept), NULLIF(trim(p_reason), ''), NULLIF(trim(p_notes), ''),
          p_reference_type, p_reference_id, p_transaction_count,
          p_commission_rate, p_reversal_of_id, p_client_request_id, p_user_id
        )
        RETURNING id INTO v_id;

        IF p_cash_details IS NOT NULL AND jsonb_array_length(p_cash_details) > 0 THEN
          FOR v_item IN SELECT * FROM jsonb_array_elements(p_cash_details)
          LOOP
            v_denomination := (v_item->>'denomination')::NUMERIC(10,2);
            v_quantity := (v_item->>'quantity')::INT;
            IF v_denomination IS NULL OR NOT guayacan_valid_denomination(v_denomination)
               OR v_quantity IS NULL OR v_quantity <= 0 THEN
              RAISE EXCEPTION 'INVALID_CASH_DENOMINATION';
            END IF;
            INSERT INTO guayacan_cash_movement_details (movement_id, denomination, quantity, subtotal)
            VALUES (v_id, v_denomination, v_quantity, v_denomination * v_quantity);
            v_breakdown_total := v_breakdown_total + v_denomination * v_quantity;
          END LOOP;
          IF v_breakdown_total <> abs(p_amount) THEN
            RAISE EXCEPTION 'CASH_BREAKDOWN_MISMATCH';
          END IF;
        END IF;

        RETURN v_id;
      END;
      $fn$;
    `);

    // INGRESO / EGRESO (montos positivos) y AJUSTE (con signo, motivo obligatorio).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_guayacan_cash_movement(
        p_movement_type VARCHAR,
        p_amount NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_concept VARCHAR,
        p_reason VARCHAR,
        p_notes VARCHAR,
        p_cash_details JSONB,
        p_client_request_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_signed NUMERIC(14,2);
      BEGIN
        IF p_amount IS NULL THEN
          RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_AMOUNT';
        END IF;
        CASE p_movement_type
          WHEN 'INGRESO' THEN
            IF p_amount <= 0 THEN RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_AMOUNT'; END IF;
            v_signed := p_amount;
          WHEN 'EGRESO' THEN
            IF p_amount <= 0 THEN RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_AMOUNT'; END IF;
            v_signed := -p_amount;
          WHEN 'AJUSTE' THEN
            IF p_amount = 0 THEN RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_AMOUNT'; END IF;
            IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
              RAISE EXCEPTION 'CASH_MOVEMENT_REASON_REQUIRED';
            END IF;
            v_signed := p_amount;
          ELSE
            RAISE EXCEPTION 'INVALID_CASH_MOVEMENT_TYPE';
        END CASE;

        RETURN apply_guayacan_cash_movement(
          p_movement_type, v_signed, p_business_date, p_user_id, p_concept, p_reason, p_notes,
          NULL, NULL, NULL, NULL, NULL, p_client_request_id, p_cash_details, false
        );
      END;
      $fn$;
    `);

    // Anular INGRESO/EGRESO/AJUSTE (admin): marca ANULADO + movimiento inverso.
    // Las comisiones se revierten solo anulando la operación de Transaccionar.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_guayacan_cash_movement(
        p_movement_id UUID,
        p_business_date DATE,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_movement RECORD;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));

        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_REASON_REQUIRED';
        END IF;

        SELECT id, movement_type, amount, status, concept INTO v_movement
        FROM guayacan_cash_movements WHERE id = p_movement_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_FOUND:%', p_movement_id;
        END IF;
        IF v_movement.status = 'ANULADO' THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_ALREADY_VOIDED:%', p_movement_id;
        END IF;
        IF v_movement.movement_type NOT IN ('INGRESO', 'EGRESO', 'AJUSTE') THEN
          RAISE EXCEPTION 'CASH_MOVEMENT_NOT_VOIDABLE:%', p_movement_id;
        END IF;

        UPDATE guayacan_cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = trim(p_reason)
        WHERE id = p_movement_id;

        RETURN apply_guayacan_cash_movement(
          'ANULACION', -v_movement.amount, p_business_date, p_user_id,
          left('Anulación — ' || v_movement.concept, 150), p_reason, NULL,
          NULL, NULL, NULL, NULL, p_movement_id, NULL, NULL, false
        );
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_agent RECORD;
      BEGIN
        IF NEW.transaction_bank_id IS NULL OR NEW.is_voided THEN
          RETURN NEW;
        END IF;

        SELECT cash_box_code, commission_per_transaction INTO v_agent
        FROM transaction_banks WHERE id = NEW.transaction_bank_id;

        IF v_agent.cash_box_code = 'GUAYACAN' AND COALESCE(v_agent.commission_per_transaction, 0) > 0 THEN
          PERFORM apply_guayacan_cash_movement(
            'COMISION_TRANSACCION',
            NEW.transaction_count * v_agent.commission_per_transaction,
            NEW.operation_date,
            NEW.user_id,
            'Comisión Transaccionar — ' || NEW.transaction_count || ' × Q' || to_char(v_agent.commission_per_transaction, 'FM999990.00'),
            NULL, NULL, 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            v_agent.commission_per_transaction, NULL, NULL, NULL, true
          );
        END IF;

        RETURN NEW;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_void()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_commission RECORD;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));

        SELECT id, amount, transaction_count, commission_rate INTO v_commission
        FROM guayacan_cash_movements
        WHERE movement_type = 'COMISION_TRANSACCION'
          AND reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id
          AND status = 'VIGENTE'
        FOR UPDATE;

        IF NOT FOUND THEN
          RETURN NEW;
        END IF;

        UPDATE guayacan_cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = NEW.voided_by,
            void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
        WHERE id = v_commission.id;

        PERFORM apply_guayacan_cash_movement(
          'REVERSO_COMISION',
          -v_commission.amount,
          (COALESCE(NEW.voided_at, now()) AT TIME ZONE 'America/Guatemala')::date,
          NEW.voided_by,
          'Reverso de comisión — operación anulada',
          NEW.void_reason, NULL, 'BANK_DEPOSIT', NEW.id, v_commission.transaction_count,
          v_commission.commission_rate, v_commission.id, NULL, NULL, true
        );

        RETURN NEW;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_guayacan_commission_insert ON bank_deposit_operations;
      CREATE TRIGGER trg_guayacan_commission_insert
        AFTER INSERT ON bank_deposit_operations
        FOR EACH ROW EXECUTE FUNCTION guayacan_commission_on_operation_insert();
    `);
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_guayacan_commission_void ON bank_deposit_operations;
      CREATE TRIGGER trg_guayacan_commission_void
        AFTER UPDATE OF is_voided ON bank_deposit_operations
        FOR EACH ROW
        WHEN (OLD.is_voided = false AND NEW.is_voided = true)
        EXECUTE FUNCTION guayacan_commission_on_operation_void();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS trg_guayacan_commission_void ON bank_deposit_operations',
    );
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS trg_guayacan_commission_insert ON bank_deposit_operations',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS guayacan_commission_on_operation_void()',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS guayacan_commission_on_operation_insert()',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_guayacan_cash_movement(UUID, DATE, UUID, VARCHAR)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_guayacan_cash_movement(VARCHAR, NUMERIC, DATE, UUID, VARCHAR, VARCHAR, VARCHAR, JSONB, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS apply_guayacan_cash_movement(VARCHAR, NUMERIC, DATE, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, UUID, INT, NUMERIC, UUID, UUID, JSONB, BOOLEAN)',
    );
    // Tablas, columnas y movimientos se conservan (historial financiero).
  }
}
