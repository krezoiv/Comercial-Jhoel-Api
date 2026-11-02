import { MigrationInterface, QueryRunner } from 'typeorm';
import { OptionalCashBreakdownInTransaccionar1760006200000 } from './1760006200000-OptionalCashBreakdownInTransaccionar';

/**
 * Cooperativa Guayacán: Depósito y Retiro mueven su cuenta al REVÉS que los
 * demás bancos agente — el Depósito SUMA al saldo de la cuenta y el Retiro
 * RESTA (en el resto, Depósito resta y Retiro suma). Se decide por el banco
 * agente de la operación (`transaction_banks.cash_box_code = 'GUAYACAN'`),
 * nunca por nombre. Reintegro, Génesis y todos los demás bancos no cambian.
 *
 * Solo cambia el signo de `v_delta` en `register_bank_deposit_operation`
 * (misma firma de 12 parámetros → `CREATE OR REPLACE`). Las reglas de saldo
 * siguen en `apply_bank_account_movement` (un Retiro Guayacán exige saldo
 * suficiente; un Depósito respeta `max_balance`). Anular sigue igual:
 * `reverse_bank_account_movements` invierte el movimiento realmente
 * aplicado, así que operaciones anteriores a este cambio se revierten bien.
 * No toca movimientos históricos.
 *
 * `down` restaura el cuerpo de `OptionalCashBreakdownInTransaccionar`.
 */
export class GuayacanInvertsDepositWithdrawal1760006400000 implements MigrationInterface {
  name = 'GuayacanInvertsDepositWithdrawal1760006400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

          -- Cooperativa Guayacán: Depósito y Retiro van al revés que en los
          -- demás bancos (el depósito SUMA a su cuenta, el retiro RESTA).
          SELECT COALESCE(cash_box_code = 'GUAYACAN', false) INTO v_is_guayacan_agent
          FROM transaction_banks WHERE id = v_transaction_bank_id;
          IF COALESCE(v_is_guayacan_agent, false)
             AND v_transaction_type.balance_effect IN ('DEPOSITO', 'RETIRO') THEN
            v_delta := -v_delta;
          END IF;

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

          PERFORM apply_bank_account_movement(
            v_bank_account_id, v_transaction_type.balance_effect, 'TRANSACCIONAR', v_delta,
            p_operation_date, p_user_id, 'BANK_DEPOSIT', v_operation_id, NULL,
            CASE WHEN v_transaction_bank_name IS NOT NULL
              THEN 'Transaccionar — ' || v_transaction_bank_name
              ELSE 'Transaccionar' END,
            NULLIF(TRIM(p_client_name), ''), v_genesis_account_id, NULL
          );

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Idempotente: columna/índice ya existen; vuelve a crear el cuerpo anterior.
    await new OptionalCashBreakdownInTransaccionar1760006200000().up(
      queryRunner,
    );
  }
}
