import { MigrationInterface, QueryRunner } from 'typeorm';
import { GuayacanInvertsDepositWithdrawal1760006400000 } from './1760006400000-GuayacanInvertsDepositWithdrawal';

/**
 * Un solo saldo para Cooperativa Guayacán: el efectivo del Kardex de
 * Cuadre de Caja Guayacán.
 *
 * Antes había dos fuentes: Transaccionar leía `banks.final_balance` de la
 * cuenta GUAYACAN (movida por `apply_bank_account_movement`) y la caja leía
 * `guayacan_cash_movements`. Ahora:
 *
 * 1. `guayacan_cash_balance()` — ÚNICA fuente: último `balance_after` del
 *    Kardex (0 sin movimientos). El backend la usa al leer la cuenta
 *    GUAYACAN (listado de bancos, tira de saldos, vista de saldos diarios).
 * 2. `register_bank_deposit_operation`: con el banco agente GUAYACAN ya no
 *    mueve la cuenta (misma firma → CREATE OR REPLACE). El efecto lo
 *    registra el trigger de caja: Depósito +, Retiro −, y Reintegro − (nuevo
 *    `TRANSACCION_REINTEGRO`; Génesis se sigue moviendo igual).
 * 3. Retiro/Reintegro Guayacán sin efectivo suficiente en la caja se
 *    rechaza (`CASH_BOX_INSUFFICIENT_BALANCE`) — es la regla de saldo
 *    suficiente que ya tenía la cuenta, ahora sobre la fuente única. Anular
 *    nunca se bloquea.
 * 4. Trigger de guarda en `bank_account_movements`: ningún movimiento nuevo
 *    sobre la cuenta GUAYACAN (ajustes, transferencias) — se usa Ingreso/
 *    Egreso/Ajuste de la caja. Solo se permite `ANULACION`, para que anular
 *    operaciones previas a este cambio siga revirtiendo su movimiento.
 *    `banks.final_balance` y el ledger histórico de esa cuenta NO se tocan.
 *
 * `down` restaura la función anterior y quita la guarda; conserva triggers
 * de caja, tipos, índices y movimientos (no se borra información).
 */
export class GuayacanSingleBalanceFromCashBox1760006700000 implements MigrationInterface {
  name = 'GuayacanSingleBalanceFromCashBox1760006700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_cash_balance()
      RETURNS NUMERIC
      LANGUAGE sql
      STABLE
      AS $fn$
        SELECT COALESCE(
          (SELECT balance_after FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1),
          0
        )::NUMERIC(14,2)
      $fn$;
    `);

    await queryRunner.query(`
      ALTER TABLE guayacan_cash_movements
        DROP CONSTRAINT IF EXISTS "CHK_guayacan_cash_movements_type",
        DROP CONSTRAINT IF EXISTS "CHK_guayacan_cash_movements_sign",
        ADD CONSTRAINT "CHK_guayacan_cash_movements_type" CHECK (movement_type IN (
          'INGRESO', 'EGRESO', 'AJUSTE', 'TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO',
          'TRANSACCION_REINTEGRO', 'ANULACION', 'COMISION_TRANSACCION', 'REVERSO_COMISION'
        )),
        ADD CONSTRAINT "CHK_guayacan_cash_movements_sign" CHECK (
          (movement_type IN ('INGRESO', 'COMISION_TRANSACCION', 'TRANSACCION_DEPOSITO') AND amount > 0)
          OR (movement_type IN ('EGRESO', 'REVERSO_COMISION', 'TRANSACCION_RETIRO', 'TRANSACCION_REINTEGRO') AND amount < 0)
          OR movement_type IN ('AJUSTE', 'ANULACION')
        )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_guayacan_cash_movements_reintegro"
        ON guayacan_cash_movements (reference_type, reference_id)
        WHERE movement_type = 'TRANSACCION_REINTEGRO'
    `);

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
        p_bank_account_id UUID DEFAULT NULL,
        p_cash_breakdown_enabled BOOLEAN DEFAULT TRUE
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
        v_cash_breakdown_enabled BOOLEAN := COALESCE(p_cash_breakdown_enabled, TRUE);
        v_is_genesis_type BOOLEAN;
        v_bank_account_id UUID := NULL;
        v_transaction_bank_id UUID := p_transaction_bank_id;
        v_delta NUMERIC(14,2);
        v_transaction_bank_name TEXT;
        v_genesis_account_id UUID := NULL;
        v_source_account_name TEXT;
        v_is_guayacan_agent BOOLEAN := false;
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
            -- Solo las cuentas habilitadas en Sistema → Bancos pueden
            -- elegirse en Transaccionar (no basta con ocultarlas en la UI).
            PERFORM 1 FROM banks
            WHERE id = p_bank_account_id AND available_in_transaccionar = true;
            IF NOT FOUND THEN
              RAISE EXCEPTION 'BANK_ACCOUNT_NOT_AVAILABLE:%', p_bank_account_id;
            END IF;
            v_bank_account_id := p_bank_account_id;
          END IF;

          -- Reintegro Génesis: abono a la línea de crédito. Además de la
          -- cuenta origen, baja el saldo de Fundación Génesis Empresarial.
          IF v_transaction_type.balance_effect = 'REINTEGRO' THEN
            SELECT id INTO v_genesis_account_id
            FROM banks
            WHERE special_account = 'GENESIS' AND is_active = true
            LIMIT 1;
            IF v_genesis_account_id IS NULL THEN
              RAISE EXCEPTION 'GENESIS_ACCOUNT_NOT_CONFIGURED:%', p_transaction_type_id;
            END IF;
            IF v_genesis_account_id = v_bank_account_id THEN
              RAISE EXCEPTION 'REINTEGRO_SOURCE_IS_GENESIS:%', p_bank_account_id;
            END IF;
          END IF;
        END IF;

        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'BANK_DEPOSIT_CLIENT_INVALID:%', p_transaction_bank_id;
          END IF;
        END IF;

        IF v_cash_breakdown_enabled THEN
          IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
            RAISE EXCEPTION 'CASH_BREAKDOWN_REQUIRED:%', p_transaction_bank_id;
          END IF;
        ELSE
          -- Sin desglose: nada de denominaciones ni vuelto (nunca un desglose ficticio).
          IF p_cash_details IS NOT NULL AND jsonb_array_length(p_cash_details) > 0 THEN
            RAISE EXCEPTION 'CASH_BREAKDOWN_NOT_EXPECTED:%', p_transaction_bank_id;
          END IF;
          IF v_change_given <> 0 THEN
            RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
          END IF;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id, client_name,
          transaction_type_id, change_given, client_id, bank_account_id,
          cash_breakdown_enabled
        ) VALUES (
          v_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), ''),
          p_transaction_type_id, v_change_given, p_client_id, v_bank_account_id,
          v_cash_breakdown_enabled
        )
        RETURNING id INTO v_operation_id;

        IF v_cash_breakdown_enabled THEN
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
        END IF;

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

        IF v_cash_breakdown_enabled THEN
          IF v_change_given > v_total_cash THEN
            RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
          END IF;

          IF (v_total_cash - v_change_given) <> p_total_amount THEN
            RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
          END IF;
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

          SELECT COALESCE(cash_box_code = 'GUAYACAN', false) INTO v_is_guayacan_agent
          FROM transaction_banks WHERE id = v_transaction_bank_id;

          SELECT name INTO v_transaction_bank_name FROM transaction_banks WHERE id = v_transaction_bank_id;

          -- Reintegro toca dos cuentas: se bloquean en orden de id (igual que
          -- register_bank_transfer) para que dos operaciones concurrentes
          -- nunca se bloqueen mutuamente.
          IF v_genesis_account_id IS NOT NULL THEN
            PERFORM 1 FROM banks
            WHERE id IN (v_bank_account_id, v_genesis_account_id)
            ORDER BY id
            FOR UPDATE;
          END IF;

          -- Cooperativa Guayacán: el saldo de su cuenta ES el efectivo del
          -- Cuadre de Caja Guayacán (guayacan_cash_balance()). Su efecto lo
          -- registra el trigger de caja sobre esta misma operación; aquí no se
          -- mueve un segundo saldo. (Génesis, en un Reintegro, sí se mueve abajo.)
          IF NOT COALESCE(v_is_guayacan_agent, false) THEN
            PERFORM apply_bank_account_movement(
              v_bank_account_id, v_transaction_type.balance_effect, 'TRANSACCIONAR', v_delta,
              p_operation_date, p_user_id, 'BANK_DEPOSIT', v_operation_id, NULL,
              CASE WHEN v_transaction_bank_name IS NOT NULL
                THEN 'Transaccionar — ' || v_transaction_bank_name
                ELSE 'Transaccionar' END,
              NULLIF(TRIM(p_client_name), ''), v_genesis_account_id, NULL
            );
          END IF;

          -- Mismo monto, mismo reference_id: anular la operación revierte
          -- ambos movimientos (reverse_bank_account_movements).
          IF v_genesis_account_id IS NOT NULL THEN
            SELECT name INTO v_source_account_name FROM banks WHERE id = v_bank_account_id;
            PERFORM apply_bank_account_movement(
              v_genesis_account_id, 'REINTEGRO', 'TRANSACCIONAR', -p_total_amount,
              p_operation_date, p_user_id, 'BANK_DEPOSIT', v_operation_id, NULL,
              'Reintegro Génesis — desde ' || v_source_account_name,
              NULLIF(TRIM(p_client_name), ''), v_bank_account_id, NULL
            );
          END IF;
        END IF;

        RETURN v_operation_id;
      END;
      $fn$;
    `);

    // Efectivo de Transaccionar: Depósito entra; Retiro y Reintegro salen y
    // exigen efectivo suficiente (la regla de saldo de la cuenta, ahora en la caja).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_agent RECORD;
        v_effect VARCHAR;
      BEGIN
        IF NEW.transaction_bank_id IS NULL OR NEW.is_voided THEN
          RETURN NEW;
        END IF;

        SELECT cash_box_code, commission_per_transaction INTO v_agent
        FROM transaction_banks WHERE id = NEW.transaction_bank_id;

        IF v_agent.cash_box_code IS DISTINCT FROM 'GUAYACAN' THEN
          RETURN NEW;
        END IF;

        IF COALESCE(v_agent.commission_per_transaction, 0) > 0 THEN
          INSERT INTO guayacan_commissions (
            operation_id, business_date, transaction_count, commission_rate, amount, created_by
          ) VALUES (
            NEW.id, NEW.operation_date, NEW.transaction_count, v_agent.commission_per_transaction,
            NEW.transaction_count * v_agent.commission_per_transaction, NEW.user_id
          )
          ON CONFLICT (operation_id) DO NOTHING;
        END IF;

        SELECT balance_effect INTO v_effect FROM transaction_types WHERE id = NEW.transaction_type_id;
        IF v_effect = 'DEPOSITO' THEN
          PERFORM apply_guayacan_cash_movement(
            'TRANSACCION_DEPOSITO', NEW.total_amount, NEW.operation_date, NEW.user_id,
            'Depósito Transaccionar — ' || NEW.transaction_count || ' trans.',
            NULL, NULLIF(TRIM(NEW.client_name), ''), 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            NULL, NULL, NULL, NULL, true
          );
        ELSIF v_effect = 'RETIRO' THEN
          PERFORM apply_guayacan_cash_movement(
            'TRANSACCION_RETIRO', -NEW.total_amount, NEW.operation_date, NEW.user_id,
            'Retiro Transaccionar — ' || NEW.transaction_count || ' trans.',
            NULL, NULLIF(TRIM(NEW.client_name), ''), 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            NULL, NULL, NULL, NULL, false
          );
        ELSIF v_effect = 'REINTEGRO' THEN
          PERFORM apply_guayacan_cash_movement(
            'TRANSACCION_REINTEGRO', -NEW.total_amount, NEW.operation_date, NEW.user_id,
            'Reintegro Génesis Transaccionar — ' || NEW.transaction_count || ' trans.',
            NULL, NULLIF(TRIM(NEW.client_name), ''), 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            NULL, NULL, NULL, NULL, false
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
        v_movement RECORD;
        v_business_date DATE := (COALESCE(NEW.voided_at, now()) AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));

        UPDATE guayacan_commissions
        SET status = 'ANULADO', voided_at = COALESCE(NEW.voided_at, now()), voided_by = NEW.voided_by,
            void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
        WHERE operation_id = NEW.id AND status = 'VIGENTE';

        SELECT id, amount, concept INTO v_movement
        FROM guayacan_cash_movements
        WHERE movement_type IN ('TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO', 'TRANSACCION_REINTEGRO')
          AND reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND status = 'VIGENTE'
        FOR UPDATE;

        IF FOUND THEN
          UPDATE guayacan_cash_movements
          SET status = 'ANULADO', voided_at = now(), voided_by = NEW.voided_by,
              void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
          WHERE id = v_movement.id;

          PERFORM apply_guayacan_cash_movement(
            'ANULACION', -v_movement.amount, v_business_date, NEW.voided_by,
            left('Anulación — ' || v_movement.concept, 150), NEW.void_reason, NULL,
            'BANK_DEPOSIT', NEW.id, NULL, NULL, v_movement.id, NULL, NULL, true
          );
        END IF;

        RETURN NEW;
      END;
      $fn$;
    `);

    // Guarda: la cuenta GUAYACAN no tiene un saldo bancario propio.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guard_guayacan_bank_account_movement()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      BEGIN
        IF NEW.movement_type <> 'ANULACION'
           AND EXISTS (SELECT 1 FROM banks WHERE id = NEW.bank_id AND special_account = 'GUAYACAN') THEN
          RAISE EXCEPTION 'GUAYACAN_BALANCE_IN_CASH_BOX:%', NEW.bank_id;
        END IF;
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_guard_guayacan_bank_account_movement ON bank_account_movements;
      CREATE TRIGGER trg_guard_guayacan_bank_account_movement
        BEFORE INSERT ON bank_account_movements
        FOR EACH ROW EXECUTE FUNCTION guard_guayacan_bank_account_movement();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TRIGGER IF EXISTS trg_guard_guayacan_bank_account_movement ON bank_account_movements',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS guard_guayacan_bank_account_movement()',
    );
    // Vuelve la función que movía también la cuenta GUAYACAN. Los triggers de
    // caja se conservan (registran el mismo efectivo; los movimientos
    // TRANSACCION_REINTEGRO ya registrados quedan válidos).
    await new GuayacanInvertsDepositWithdrawal1760006400000().up(queryRunner);
  }
}
