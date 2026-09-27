import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Transferencias Bancarias — dos reglas nuevas, puramente incrementales:
 *
 * 1. **Retiro de efectivo en banco**: `register_bank_transfer` acepta
 *    `p_destination_bank_id = NULL`, que registra UN solo movimiento
 *    `RETIRO_EFECTIVO` (resta el saldo del origen; nada se acredita a otra
 *    cuenta). Mismas validaciones que una transferencia (monto > 0, saldo
 *    suficiente — ni Génesis puede quedar negativo por esto). Queda con
 *    `reference_type = 'BANK_TRANSFER'`, así que se lista, se reporta y se
 *    anula (movimiento inverso) igual que una transferencia.
 * 2. **BI Club Empresarial como origen solo traslada a Banco Industrial**
 *    (`TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB`), incluido el retiro de
 *    efectivo. La regla anterior (BI Club solo RECIBE de Banco Industrial)
 *    se conserva.
 *
 * El CHECK de `movement_type` se reemplaza (DROP CONSTRAINT + ADD) solo para
 * añadir `RETIRO_EFECTIVO`: ninguna fila cambia y todos los valores
 * existentes siguen siendo válidos. Funciones con la misma firma →
 * `CREATE OR REPLACE`.
 */
export class AddCashWithdrawalToBankTransfers1760005300000 implements MigrationInterface {
  name = 'AddCashWithdrawalToBankTransfers1760005300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_account_movements
        DROP CONSTRAINT "CHK_bank_account_movements_type",
        ADD CONSTRAINT "CHK_bank_account_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO',
          'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'RETIRO_EFECTIVO',
          'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION'
        ))
    `);

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
             OR p_movement_type IN ('TRANSFERENCIA_SALIDA', 'RETIRO_EFECTIVO') THEN
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

        -- BI Club Empresarial como ORIGEN: solo puede trasladar a Banco
        -- Industrial (tampoco admite retiro de efectivo).
        IF v_source.special_account = 'BI_CLUB' THEN
          IF p_destination_bank_id IS NULL THEN
            RAISE EXCEPTION 'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB';
          END IF;
          PERFORM 1 FROM banks WHERE id = p_destination_bank_id AND special_account = 'BANCO_INDUSTRIAL';
          IF NOT FOUND THEN
            RAISE EXCEPTION 'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB';
          END IF;
        END IF;

        -- Sin destino = retiro de efectivo en banco: solo sale dinero del
        -- origen, nada se acredita a otra cuenta.
        IF p_destination_bank_id IS NULL THEN
          PERFORM apply_bank_account_movement(
            p_source_bank_id, 'RETIRO_EFECTIVO', 'TRANSFERENCIA', -p_amount,
            p_business_date, p_user_id, 'BANK_TRANSFER', v_transfer_id,
            p_reference_text, p_concept, NULL, NULL, NULL
          );
          RETURN v_transfer_id;
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
          AND movement_type IN ('TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'RETIRO_EFECTIVO');
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
  }

  public async down(): Promise<void> {
    // Sin downgrade: una vez que existan movimientos RETIRO_EFECTIVO reales,
    // volver al CHECK anterior los dejaría inválidos (mismo criterio que
    // `CreateBankAccountMovements`).
  }
}
