import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Saldos bancarios dinámicos — `banks.final_balance` deja de ser un valor que
 * se escribe a mano cada día ("Guardar Cambios" en Agentes Bancarios →
 * Bancos) y pasa a ser el saldo ACTUAL materializado de cada cuenta, movido
 * únicamente por operaciones financieras registradas en un ledger nuevo,
 * `bank_account_movements`. Toda modificación de saldo pasa por UNA sola
 * función (`apply_bank_account_movement`), que bloquea la fila de `banks`
 * (`SELECT ... FOR UPDATE`), valida, escribe el movimiento (saldo anterior /
 * monto / saldo posterior) y actualiza `banks.final_balance` en la misma
 * transacción — dos operaciones concurrentes sobre la misma cuenta quedan
 * serializadas y nunca usan el mismo saldo viejo.
 *
 * Estrictamente incremental — no se borra ni reescribe ningún dato:
 *
 * - `banks`: dos columnas nuevas NULLABLE (`special_account`, `max_balance`)
 *   rellenadas por nombre (reglas de Génesis / BI Club / Districol /
 *   Banco Industrial / Banco Agromercantil), editables luego desde Sistema →
 *   Bancos. Se retira el CHECK `final_balance >= 0` (la línea de crédito de
 *   Fundación Génesis puede quedar en negativo = "saldo a favor"); la regla
 *   "una cuenta normal nunca queda negativa" pasa a vivir en la función.
 * - `bank_balances`: se retiran sus dos CHECK `>= 0` por la misma razón (la
 *   foto diaria de Génesis puede ser negativa). Ninguna fila cambia.
 * - `transaction_types.balance_effect`: qué hace cada tipo sobre el saldo
 *   (DEPOSITO / RETIRO / DESEMBOLSO_GENESIS / PAGO_GENESIS / REINTEGRO, o
 *   NULL = no mueve saldo, p. ej. Remesas / Pago de Cheque). Rellenado por
 *   nombre; se agrega el tipo "Reintegros" si no existe.
 * - `bank_deposit_operations`: `bank_account_id` (cuenta cuyo saldo movió la
 *   operación) y `transaction_bank_id` pasa a NULLABLE — Desembolsos/Pagos
 *   Génesis no muestran selector de banco agente, la cuenta se resuelve sola.
 * - Saldo inicial: cada banco existente recibe UN movimiento `SALDO_INICIAL`
 *   con su `final_balance` actual, de modo que la suma del ledger siempre
 *   iguala el saldo materializado. Las operaciones históricas de
 *   Transaccionar NO se re-aplican (ya estaban reflejadas en el saldo que
 *   el usuario registraba a mano).
 *
 * `save_bank_balance` (la foto diaria que exige el cierre del día) deja de
 * sobrescribir `banks.final_balance`: una corrección de saldo real ahora es
 * un AJUSTE_MANUAL auditado (solo admin), nunca una escritura silenciosa.
 */
export class CreateBankAccountMovements1760005100000 implements MigrationInterface {
  name = 'CreateBankAccountMovements1760005100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // banks — reglas especiales y límite configurable
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE banks
        ADD COLUMN special_account VARCHAR(30) NULL,
        ADD COLUMN max_balance NUMERIC(14,2) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE banks
        ADD CONSTRAINT "CHK_banks_special_account" CHECK (
          special_account IS NULL OR special_account IN (
            'GENESIS', 'BI_CLUB', 'DISTRICOL', 'BANCO_INDUSTRIAL', 'BANCO_AGROMERCANTIL'
          )
        ),
        ADD CONSTRAINT "CHK_banks_max_balance_non_negative" CHECK (
          max_balance IS NULL OR max_balance >= 0
        )
    `);
    // Génesis/BI Club/Districol identifican UNA cuenta cada una (el sistema
    // la resuelve sola); Banco Industrial/Agromercantil pueden tener varias.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_banks_special_account_single_active"
      ON banks (special_account)
      WHERE is_active = true AND special_account IN ('GENESIS', 'BI_CLUB', 'DISTRICOL')
    `);
    await queryRunner.query(
      'ALTER TABLE banks DROP CONSTRAINT IF EXISTS chk_banks_final_balance_non_negative',
    );
    await queryRunner.query(
      'ALTER TABLE bank_balances DROP CONSTRAINT IF EXISTS chk_bank_balances_final_balance_non_negative',
    );
    await queryRunner.query(
      'ALTER TABLE bank_balances DROP CONSTRAINT IF EXISTS chk_bank_balances_previous_balance_non_negative',
    );

    // Relleno por nombre normalizado (sin acentos / minúsculas). Solo la
    // cuenta activa más antigua por regla única, para no chocar con el
    // índice parcial si hubiera duplicados.
    await queryRunner.query(`
      UPDATE banks SET special_account = 'GENESIS', max_balance = 120000
      WHERE id = (
        SELECT id FROM banks
        WHERE is_active = true AND search_normalize(name) LIKE '%genesis%'
        ORDER BY created_at LIMIT 1
      )
    `);
    await queryRunner.query(`
      UPDATE banks SET special_account = 'BI_CLUB', max_balance = 75000
      WHERE id = (
        SELECT id FROM banks
        WHERE is_active = true AND search_normalize(name) LIKE '%bi club%'
        ORDER BY created_at LIMIT 1
      )
    `);
    await queryRunner.query(`
      UPDATE banks SET special_account = 'DISTRICOL'
      WHERE id = (
        SELECT id FROM banks
        WHERE is_active = true AND search_normalize(name) LIKE '%districol%'
        ORDER BY created_at LIMIT 1
      )
    `);
    await queryRunner.query(`
      UPDATE banks SET special_account = 'BANCO_INDUSTRIAL'
      WHERE special_account IS NULL AND search_normalize(btrim(name)) = 'banco industrial'
    `);
    await queryRunner.query(`
      UPDATE banks SET special_account = 'BANCO_AGROMERCANTIL'
      WHERE special_account IS NULL AND search_normalize(btrim(name)) = 'banco agromercantil'
    `);

    // ------------------------------------------------------------------
    // transaction_types.balance_effect
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE transaction_types
        ADD COLUMN balance_effect VARCHAR(30) NULL,
        ADD CONSTRAINT "CHK_transaction_types_balance_effect" CHECK (
          balance_effect IS NULL OR balance_effect IN (
            'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO'
          )
        )
    `);
    await queryRunner.query(`
      UPDATE transaction_types SET balance_effect = CASE
        WHEN search_normalize(name) LIKE 'deposito%' THEN 'DEPOSITO'
        WHEN search_normalize(name) LIKE 'retiro%' THEN 'RETIRO'
        WHEN search_normalize(name) LIKE '%desembolso%' OR search_normalize(name) LIKE '%renovacion%' THEN 'DESEMBOLSO_GENESIS'
        WHEN search_normalize(name) LIKE '%pago%' AND search_normalize(name) LIKE '%genesis%' THEN 'PAGO_GENESIS'
        WHEN search_normalize(name) LIKE '%reintegro%' THEN 'REINTEGRO'
        ELSE NULL
      END
    `);
    // "Reintegros" es una de las seis operaciones que mueven saldo; si el
    // catálogo aún no la tiene, se agrega (autor: el primer SUPER_ADMIN/ADMIN).
    await queryRunner.query(`
      INSERT INTO transaction_types (name, icon, balance_effect, created_by)
      SELECT 'Reintegros', 'refresh-cw', 'REINTEGRO', u.id
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE r.name IN ('SUPER_ADMIN', 'ADMIN')
        AND NOT EXISTS (
          SELECT 1 FROM transaction_types
          WHERE is_active = true
            AND (balance_effect = 'REINTEGRO' OR search_normalize(name) = 'reintegros')
        )
      ORDER BY u.created_at
      LIMIT 1
    `);

    // ------------------------------------------------------------------
    // bank_deposit_operations — cuenta afectada
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        ADD COLUMN bank_account_id UUID NULL,
        ALTER COLUMN transaction_bank_id DROP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        ADD CONSTRAINT "FK_bank_deposit_operations_bank_account"
          FOREIGN KEY (bank_account_id) REFERENCES banks(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_bank_deposit_operations_bank_reference" CHECK (
          transaction_bank_id IS NOT NULL OR bank_account_id IS NOT NULL
        )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_bank_deposit_operations_bank_account_id"
      ON bank_deposit_operations (bank_account_id)
    `);

    // ------------------------------------------------------------------
    // bank_account_movements — el ledger. `amount` es el delta CON signo
    // (negativo = disminuye el saldo); el CHECK de consistencia garantiza a
    // nivel de base de datos que saldo_anterior + monto = saldo_posterior.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE bank_account_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL,
        bank_id UUID NOT NULL,
        movement_type VARCHAR(30) NOT NULL,
        origin VARCHAR(30) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        balance_before NUMERIC(14,2) NOT NULL,
        balance_after NUMERIC(14,2) NOT NULL,
        business_date DATE NOT NULL,
        user_id UUID NOT NULL,
        reference_type VARCHAR(40) NULL,
        reference_id UUID NULL,
        reference_text VARCHAR(100) NULL,
        concept VARCHAR(255) NULL,
        observation TEXT NULL,
        counterpart_bank_id UUID NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'APLICADO',
        reversal_of_id UUID NULL,
        reversed_at TIMESTAMPTZ NULL,
        reversed_by UUID NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_bank_account_movements_bank" FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE RESTRICT,
        CONSTRAINT "FK_bank_account_movements_user" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        CONSTRAINT "FK_bank_account_movements_counterpart" FOREIGN KEY (counterpart_bank_id) REFERENCES banks(id) ON DELETE RESTRICT,
        CONSTRAINT "FK_bank_account_movements_reversal_of" FOREIGN KEY (reversal_of_id) REFERENCES bank_account_movements(id) ON DELETE RESTRICT,
        CONSTRAINT "FK_bank_account_movements_reversed_by" FOREIGN KEY (reversed_by) REFERENCES users(id) ON DELETE RESTRICT,
        CONSTRAINT "CHK_bank_account_movements_consistency" CHECK (balance_after = balance_before + amount),
        CONSTRAINT "CHK_bank_account_movements_amount" CHECK (amount <> 0 OR movement_type = 'SALDO_INICIAL'),
        CONSTRAINT "CHK_bank_account_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO',
          'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION'
        )),
        CONSTRAINT "CHK_bank_account_movements_origin" CHECK (origin IN (
          'TRANSACCIONAR', 'TRANSFERENCIA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION'
        )),
        CONSTRAINT "CHK_bank_account_movements_status" CHECK (status IN ('APLICADO', 'ANULADO')),
        CONSTRAINT "CHK_bank_account_movements_reference_pair" CHECK (
          (reference_type IS NULL AND reference_id IS NULL)
          OR (reference_type IS NOT NULL AND reference_id IS NOT NULL)
        ),
        CONSTRAINT "CHK_bank_account_movements_reversal_state" CHECK (
          (status = 'APLICADO' AND reversed_at IS NULL AND reversed_by IS NULL)
          OR (status = 'ANULADO' AND reversed_at IS NOT NULL AND reversed_by IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_bank_account_movements_bank_sequence" ON bank_account_movements (bank_id, sequence)',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bank_account_movements_business_date" ON bank_account_movements (business_date)',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bank_account_movements_reference" ON bank_account_movements (reference_type, reference_id)',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_bank_account_movements_user_id" ON bank_account_movements (user_id)',
    );

    // Saldo inicial — un movimiento por banco con su saldo actual, para
    // que el ledger arranque consistente con `banks.final_balance`.
    await queryRunner.query(`
      INSERT INTO bank_account_movements (
        bank_id, movement_type, origin, amount, balance_before, balance_after,
        business_date, user_id, concept
      )
      SELECT
        b.id, 'SALDO_INICIAL', 'SALDO_INICIAL', b.final_balance, 0, b.final_balance,
        CURRENT_DATE, COALESCE(b.updated_by, b.created_by),
        'Saldo inicial al activar saldos dinámicos'
      FROM banks b
      ORDER BY b.name, b.created_at
    `);

    // ==================================================================
    // apply_bank_account_movement — el ÚNICO punto que modifica
    // banks.final_balance. Reglas:
    //  * monto (delta) distinto de cero;
    //  * cuenta existente y activa (una ANULACION se permite aun sobre una
    //    cuenta desactivada, para no dejar una reversión imposible);
    //  * ninguna cuenta queda negativa, EXCEPTO la línea de crédito de
    //    Fundación Génesis (special_account = 'GENESIS'), que sí puede
    //    quedar en negativo ("saldo a favor") salvo por una transferencia
    //    saliente — una transferencia nunca puede superar el saldo del
    //    origen;
    //  * un aumento no puede dejar el saldo por encima de `max_balance`
    //    (BI Club Q75,000 / Génesis Q120,000, configurables). No aplica a
    //    AJUSTE_MANUAL (corrección administrativa) ni a ANULACION (restaura
    //    un estado previo).
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION apply_bank_account_movement(
        p_bank_id UUID,
        p_movement_type VARCHAR,
        p_origin VARCHAR,
        p_delta NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_reference_type VARCHAR DEFAULT NULL,
        p_reference_id UUID DEFAULT NULL,
        p_reference_text VARCHAR DEFAULT NULL,
        p_concept VARCHAR DEFAULT NULL,
        p_observation TEXT DEFAULT NULL,
        p_counterpart_bank_id UUID DEFAULT NULL,
        p_reversal_of_id UUID DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_before NUMERIC(14,2);
        v_after NUMERIC(14,2);
        v_movement_id UUID;
      BEGIN
        IF p_delta IS NULL OR p_delta = 0 THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_AMOUNT:%', p_bank_id;
        END IF;
        IF p_business_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_OPERATION_DATE:%', p_bank_id;
        END IF;

        SELECT id, name, is_active, final_balance, special_account, max_balance
        INTO v_bank
        FROM banks
        WHERE id = p_bank_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF NOT v_bank.is_active AND p_movement_type <> 'ANULACION' THEN
          RAISE EXCEPTION 'BANK_INACTIVE:%', p_bank_id;
        END IF;

        v_before := v_bank.final_balance;
        v_after := v_before + p_delta;

        IF p_delta < 0 AND v_after < 0 THEN
          IF v_bank.special_account IS DISTINCT FROM 'GENESIS'
             OR p_movement_type = 'TRANSFERENCIA_SALIDA' THEN
            RAISE EXCEPTION 'INSUFFICIENT_BALANCE:%', p_movement_type;
          END IF;
        END IF;

        IF p_delta > 0
           AND v_bank.max_balance IS NOT NULL
           AND v_after > v_bank.max_balance
           AND p_movement_type NOT IN ('AJUSTE_MANUAL', 'ANULACION') THEN
          RAISE EXCEPTION 'BALANCE_LIMIT_EXCEEDED:%:%:%:%',
            p_movement_type, COALESCE(v_bank.special_account, ''), v_bank.max_balance, v_bank.name;
        END IF;

        UPDATE banks SET final_balance = v_after, updated_at = now() WHERE id = p_bank_id;

        INSERT INTO bank_account_movements (
          bank_id, movement_type, origin, amount, balance_before, balance_after,
          business_date, user_id, reference_type, reference_id, reference_text,
          concept, observation, counterpart_bank_id, reversal_of_id
        ) VALUES (
          p_bank_id, p_movement_type, p_origin, p_delta, v_before, v_after,
          p_business_date, p_user_id, p_reference_type, p_reference_id,
          NULLIF(btrim(p_reference_text), ''), NULLIF(btrim(p_concept), ''),
          NULLIF(btrim(p_observation), ''), p_counterpart_bank_id, p_reversal_of_id
        )
        RETURNING id INTO v_movement_id;

        RETURN v_movement_id;
      END;
      $fn$;
    `);

    // ==================================================================
    // reverse_bank_account_movements — anula (nunca borra) todos los
    // movimientos APLICADOS de una referencia: marca el original como
    // ANULADO y registra el movimiento inverso (ANULACION) enlazado.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reverse_bank_account_movements(
        p_reference_type VARCHAR,
        p_reference_id UUID,
        p_business_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS INTEGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_movement RECORD;
        v_count INTEGER := 0;
      BEGIN
        -- Orden por bank_id: dos reversiones concurrentes que tocan las
        -- mismas cuentas siempre bloquean en el mismo orden (sin deadlock).
        FOR v_movement IN
          SELECT * FROM bank_account_movements
          WHERE reference_type = p_reference_type
            AND reference_id = p_reference_id
            AND status = 'APLICADO'
            AND movement_type <> 'ANULACION'
          ORDER BY bank_id, sequence
          FOR UPDATE
        LOOP
          PERFORM apply_bank_account_movement(
            v_movement.bank_id, 'ANULACION', 'ANULACION', -v_movement.amount,
            p_business_date, p_user_id, p_reference_type, p_reference_id,
            v_movement.reference_text, 'Anulación: ' || COALESCE(v_movement.concept, v_movement.movement_type),
            p_reason, v_movement.counterpart_bank_id, v_movement.id
          );
          UPDATE bank_account_movements
          SET status = 'ANULADO', reversed_at = now(), reversed_by = p_user_id
          WHERE id = v_movement.id;
          v_count := v_count + 1;
        END LOOP;
        RETURN v_count;
      END;
      $fn$;
    `);

    // ==================================================================
    // register_bank_transfer — origen → destino, atómico. Bloquea ambas
    // cuentas en orden de id (sin deadlocks entre transferencias cruzadas).
    // Reglas especiales de destino:
    //   BI Club Empresarial ← solo Banco Industrial
    //   Districol           ← solo Banco Agromercantil
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_transfer(
        p_source_bank_id UUID,
        p_destination_bank_id UUID,
        p_amount NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_reference_text VARCHAR DEFAULT NULL,
        p_concept VARCHAR DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_source RECORD;
        v_destination RECORD;
        v_transfer_id UUID := gen_random_uuid();
      BEGIN
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_AMOUNT:%', p_source_bank_id;
        END IF;
        IF p_source_bank_id = p_destination_bank_id THEN
          RAISE EXCEPTION 'SAME_ACCOUNT_TRANSFER:%', p_source_bank_id;
        END IF;

        PERFORM 1 FROM banks
        WHERE id IN (p_source_bank_id, p_destination_bank_id)
        ORDER BY id
        FOR UPDATE;

        SELECT id, is_active, special_account INTO v_source FROM banks WHERE id = p_source_bank_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_source_bank_id;
        END IF;
        SELECT id, is_active, special_account INTO v_destination FROM banks WHERE id = p_destination_bank_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_destination_bank_id;
        END IF;

        IF v_destination.special_account = 'BI_CLUB'
           AND v_source.special_account IS DISTINCT FROM 'BANCO_INDUSTRIAL' THEN
          RAISE EXCEPTION 'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB';
        END IF;
        IF v_destination.special_account = 'DISTRICOL'
           AND v_source.special_account IS DISTINCT FROM 'BANCO_AGROMERCANTIL' THEN
          RAISE EXCEPTION 'TRANSFER_ORIGIN_NOT_ALLOWED:DISTRICOL';
        END IF;

        PERFORM apply_bank_account_movement(
          p_source_bank_id, 'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA', -p_amount,
          p_business_date, p_user_id, 'BANK_TRANSFER', v_transfer_id,
          p_reference_text, p_concept, NULL, p_destination_bank_id, NULL
        );
        PERFORM apply_bank_account_movement(
          p_destination_bank_id, 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA', p_amount,
          p_business_date, p_user_id, 'BANK_TRANSFER', v_transfer_id,
          p_reference_text, p_concept, NULL, p_source_bank_id, NULL
        );

        RETURN v_transfer_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_bank_transfer(
        p_transfer_id UUID,
        p_business_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_total INTEGER;
        v_reversed INTEGER;
      BEGIN
        IF p_reason IS NULL OR btrim(p_reason) = '' THEN
          RAISE EXCEPTION 'REASON_REQUIRED:%', p_transfer_id;
        END IF;

        SELECT COUNT(*) INTO v_total FROM bank_account_movements
        WHERE reference_type = 'BANK_TRANSFER' AND reference_id = p_transfer_id
          AND movement_type IN ('TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA');
        IF v_total = 0 THEN
          RAISE EXCEPTION 'TRANSFER_NOT_FOUND:%', p_transfer_id;
        END IF;

        v_reversed := reverse_bank_account_movements('BANK_TRANSFER', p_transfer_id, p_business_date, p_user_id, p_reason);
        IF v_reversed = 0 THEN
          RAISE EXCEPTION 'TRANSFER_ALREADY_VOIDED:%', p_transfer_id;
        END IF;
      END;
      $fn$;
    `);

    // ==================================================================
    // adjust_bank_balance — AJUSTE MANUAL (solo admin, se valida en la
    // aplicación). Registra la diferencia como un movimiento; nunca
    // sobrescribe ni borra historial. Motivo obligatorio.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION adjust_bank_balance(
        p_bank_id UUID,
        p_new_balance NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_reason VARCHAR,
        p_observation TEXT DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_current NUMERIC(14,2);
      BEGIN
        IF p_reason IS NULL OR btrim(p_reason) = '' THEN
          RAISE EXCEPTION 'REASON_REQUIRED:%', p_bank_id;
        END IF;
        IF p_new_balance IS NULL THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_AMOUNT:%', p_bank_id;
        END IF;

        SELECT final_balance INTO v_current FROM banks WHERE id = p_bank_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF v_current = p_new_balance THEN
          RAISE EXCEPTION 'BALANCE_UNCHANGED:%', p_bank_id;
        END IF;

        RETURN apply_bank_account_movement(
          p_bank_id, 'AJUSTE_MANUAL', 'AJUSTE_MANUAL', p_new_balance - v_current,
          p_business_date, p_user_id, NULL, NULL, NULL, p_reason, p_observation, NULL, NULL
        );
      END;
      $fn$;
    `);

    // ==================================================================
    // register_bank_deposit_operation — gana `p_bank_account_id`. Cuerpo
    // idéntico a la versión de `AddClientAndReferenceForBankDepositReceivables`
    // salvo: (a) `transaction_bank_id` solo es obligatorio para tipos que
    // no son de Génesis, (b) resuelve la cuenta afectada según
    // `transaction_types.balance_effect`, (c) al final aplica el movimiento
    // de saldo por `p_total_amount` (monto aplicado: efectivo − vuelto),
    // dentro de la MISMA transacción — si la validación de saldo falla, la
    // operación completa (cuadre, desglose, transacciones) se revierte.
    // ==================================================================
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID, UUID, VARCHAR, NUMERIC, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_deposit_operation(
        p_transaction_bank_id UUID,
        p_total_amount NUMERIC,
        p_operation_date DATE,
        p_cash_details JSONB,
        p_transaction_amounts JSONB,
        p_user_id UUID,
        p_transaction_type_id UUID,
        p_client_name VARCHAR DEFAULT NULL,
        p_change_given NUMERIC DEFAULT 0,
        p_client_id UUID DEFAULT NULL,
        p_bank_account_id UUID DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_transaction_type RECORD;
        v_operation_id UUID;
        v_cash_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_total_cash NUMERIC(14,2) := 0;
        v_amount_text TEXT;
        v_amount NUMERIC(14,2);
        v_sequence INT := 0;
        v_total_distributed NUMERIC(14,2) := 0;
        v_change_given NUMERIC(14,2) := COALESCE(p_change_given, 0);
        v_is_genesis_type BOOLEAN;
        v_bank_account_id UUID := NULL;
        v_transaction_bank_id UUID := p_transaction_bank_id;
        v_delta NUMERIC(14,2);
        v_transaction_bank_name TEXT;
      BEGIN
        IF p_total_amount IS NULL OR p_total_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF v_change_given < 0 THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        SELECT id, is_active, balance_effect INTO v_transaction_type
        FROM transaction_types
        WHERE id = p_transaction_type_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_NOT_FOUND:%', p_transaction_type_id;
        END IF;
        IF NOT v_transaction_type.is_active THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_INACTIVE:%', p_transaction_type_id;
        END IF;

        v_is_genesis_type := v_transaction_type.balance_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS');

        IF v_is_genesis_type THEN
          -- Desembolsos/Pagos Génesis: sin selector de banco; la cuenta es
          -- siempre la línea de crédito de Fundación Génesis Empresarial.
          v_transaction_bank_id := NULL;
          SELECT id INTO v_bank_account_id
          FROM banks
          WHERE special_account = 'GENESIS' AND is_active = true
          LIMIT 1;
          IF v_bank_account_id IS NULL THEN
            RAISE EXCEPTION 'GENESIS_ACCOUNT_NOT_CONFIGURED:%', p_transaction_type_id;
          END IF;
        ELSE
          SELECT id, is_active INTO v_bank
          FROM transaction_banks
          WHERE id = p_transaction_bank_id
          FOR UPDATE;

          IF NOT FOUND THEN
            RAISE EXCEPTION 'TRANSACTION_BANK_NOT_FOUND:%', p_transaction_bank_id;
          END IF;
          IF NOT v_bank.is_active THEN
            RAISE EXCEPTION 'TRANSACTION_BANK_INACTIVE:%', p_transaction_bank_id;
          END IF;

          IF v_transaction_type.balance_effect IS NOT NULL THEN
            IF p_bank_account_id IS NULL THEN
              RAISE EXCEPTION 'BANK_ACCOUNT_REQUIRED:%', p_transaction_type_id;
            END IF;
            v_bank_account_id := p_bank_account_id;
          END IF;
        END IF;

        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'BANK_DEPOSIT_CLIENT_INVALID:%', p_transaction_bank_id;
          END IF;
        END IF;

        IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id, client_name,
          transaction_type_id, change_given, client_id, bank_account_id
        ) VALUES (
          v_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), ''),
          p_transaction_type_id, v_change_given, p_client_id, v_bank_account_id
        )
        RETURNING id INTO v_operation_id;

        FOR v_cash_item IN SELECT * FROM jsonb_array_elements(p_cash_details)
        LOOP
          v_denomination := (v_cash_item->>'denomination')::NUMERIC(10,2);
          v_quantity := (v_cash_item->>'quantity')::INT;

          IF v_denomination IS NULL OR v_denomination <= 0
             OR v_quantity IS NULL OR v_quantity < 0 THEN
            RAISE EXCEPTION 'INVALID_CASH_QUANTITY:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_cash_details (operation_id, denomination, quantity, subtotal)
          VALUES (v_operation_id, v_denomination, v_quantity, v_denomination * v_quantity);

          v_total_cash := v_total_cash + (v_denomination * v_quantity);
        END LOOP;

        FOR v_amount_text IN SELECT * FROM jsonb_array_elements_text(p_transaction_amounts)
        LOOP
          v_sequence := v_sequence + 1;
          v_amount := v_amount_text::NUMERIC(14,2);

          IF v_amount IS NULL OR v_amount <= 0 THEN
            RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_transactions (operation_id, sequence, amount)
          VALUES (v_operation_id, v_sequence, v_amount);

          v_total_distributed := v_total_distributed + v_amount;
        END LOOP;

        IF v_change_given > v_total_cash THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        IF (v_total_cash - v_change_given) <> p_total_amount THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF v_total_distributed <> p_total_amount THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        UPDATE bank_deposit_operations
        SET total_cash = v_total_cash, total_distributed = v_total_distributed
        WHERE id = v_operation_id;

        -- Movimiento de saldo por el MONTO APLICADO (nunca el efectivo
        -- recibido): Depósito/Desembolso/Reintegro restan; Retiro/Pago suman.
        IF v_bank_account_id IS NOT NULL THEN
          v_delta := CASE v_transaction_type.balance_effect
            WHEN 'RETIRO' THEN p_total_amount
            WHEN 'PAGO_GENESIS' THEN p_total_amount
            ELSE -p_total_amount
          END;

          SELECT name INTO v_transaction_bank_name FROM transaction_banks WHERE id = v_transaction_bank_id;

          PERFORM apply_bank_account_movement(
            v_bank_account_id, v_transaction_type.balance_effect, 'TRANSACCIONAR', v_delta,
            p_operation_date, p_user_id, 'BANK_DEPOSIT', v_operation_id, NULL,
            CASE WHEN v_transaction_bank_name IS NOT NULL
              THEN 'Transaccionar — ' || v_transaction_bank_name
              ELSE 'Transaccionar' END,
            NULLIF(TRIM(p_client_name), ''), NULL, NULL
          );
        END IF;

        RETURN v_operation_id;
      END;
      $fn$;
    `);

    // ==================================================================
    // void_bank_deposit_operation — la anulación de Transaccionar pasa a
    // ser atómica con su movimiento inverso de saldo. Nunca borra nada.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_bank_deposit_operation(
        p_operation_id UUID,
        p_business_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_operation RECORD;
      BEGIN
        SELECT id, is_voided INTO v_operation
        FROM bank_deposit_operations
        WHERE id = p_operation_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_DEPOSIT_OPERATION_NOT_FOUND:%', p_operation_id;
        END IF;
        IF v_operation.is_voided THEN
          RAISE EXCEPTION 'BANK_DEPOSIT_OPERATION_ALREADY_VOIDED:%', p_operation_id;
        END IF;

        UPDATE bank_deposit_operations
        SET is_voided = true, voided_at = now(), voided_by = p_user_id,
            void_reason = p_reason, updated_at = now()
        WHERE id = p_operation_id;

        PERFORM reverse_bank_account_movements('BANK_DEPOSIT', p_operation_id, p_business_date, p_user_id, p_reason);
      END;
      $fn$;
    `);

    // ==================================================================
    // save_bank_balance — la foto diaria (requerida por el cierre del día)
    // ya NO sobrescribe banks.final_balance. `p_final_balance` NULL = tomar
    // el saldo actual dinámico de la cuenta (el caso normal para "hoy").
    // Un valor negativo solo se admite para la línea de crédito de Génesis.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION save_bank_balance(
        p_bank_id UUID,
        p_operation_date DATE,
        p_final_balance NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_previous_balance NUMERIC(12,2);
        v_final_balance NUMERIC(12,2);
        v_balance_id UUID;
      BEGIN
        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_OPERATION_DATE:%', p_bank_id;
        END IF;

        SELECT id, is_active, previous_balance, final_balance, special_account INTO v_bank
        FROM banks WHERE id = p_bank_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'BANK_INACTIVE:%', p_bank_id;
        END IF;

        v_final_balance := COALESCE(p_final_balance, v_bank.final_balance);

        IF v_final_balance < 0 AND v_bank.special_account IS DISTINCT FROM 'GENESIS' THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_bank_id;
        END IF;

        SELECT final_balance INTO v_previous_balance
        FROM bank_balances
        WHERE bank_id = p_bank_id AND operation_date < p_operation_date
        ORDER BY operation_date DESC
        LIMIT 1;

        IF v_previous_balance IS NULL THEN
          v_previous_balance := COALESCE(v_bank.previous_balance, 0);
        END IF;

        INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
        VALUES (p_bank_id, p_operation_date, v_previous_balance, v_final_balance, p_user_id)
        ON CONFLICT (bank_id, operation_date)
        DO UPDATE SET
          previous_balance = EXCLUDED.previous_balance,
          final_balance = EXCLUDED.final_balance,
          user_id = EXCLUDED.user_id,
          updated_at = now()
        RETURNING id INTO v_balance_id;

        RETURN v_balance_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // Sin downgrade a propósito — mismo precedente que
    // `AddChangeGivenToBankDepositOperations`: una vez que existan
    // movimientos reales (y saldos negativos válidos de Génesis), volver a
    // la versión anterior de las funciones/CHECKs dejaría datos reales
    // "inválidos" o descartaría historial financiero. Revertir exige una
    // migración nueva y deliberada, nunca un DROP automático del ledger.
  }
}
