import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * BI Club Empresarial pasa a comportarse como LÍNEA DE CRÉDITO: su saldo
 * (`banks.final_balance`) es el saldo de la línea — Q0.00 = nada utilizado,
 * negativo = monto utilizado/adeudado. Siempre `-max_balance <= saldo <= 0`.
 *
 *   Banco Industrial → BI Club (uso de la línea):
 *     Banco Industrial  saldo − monto   (regla normal: saldo suficiente)
 *     BI Club           saldo − monto   (nuevo ≥ −límite)
 *   BI Club → Banco Industrial (pago / devolución):
 *     BI Club           saldo + monto   (nuevo ≤ 0; si no hay deuda, se rechaza)
 *     Banco Industrial  saldo + monto
 *
 * Estrictamente incremental — ninguna tabla, columna ni fila existente se
 * borra o reescribe; solo `CREATE OR REPLACE` de funciones con la MISMA firma:
 *
 * - `apply_bank_account_movement` (el único punto que modifica
 *   `banks.final_balance`, con `FOR UPDATE`): para `special_account =
 *   'BI_CLUB'` reemplaza las reglas de cuenta normal (no negativo /
 *   `max_balance` como techo) por las de la línea: un movimiento que resta
 *   no puede dejar el saldo por debajo de `-max_balance`
 *   (`CREDIT_LINE_LIMIT_EXCEEDED`); uno que suma no puede dejarlo positivo
 *   (`CREDIT_LINE_NO_DEBT` si no había deuda, `CREDIT_LINE_OVERPAYMENT` si
 *   excede lo adeudado). Aplica a TODO tipo de movimiento (transferencia,
 *   Transaccionar, acreditación, ajuste manual y anulación), así el
 *   invariante no puede romperse por ningún camino. El límite sigue siendo
 *   `banks.max_balance` (configurable en Sistema → Bancos, única fuente de
 *   verdad); NULL = línea sin límite asignado = no se puede utilizar.
 * - `register_bank_transfer`: el delta de cada lado depende de su propia
 *   regla (BI Club como destino resta, como origen suma). Las reglas de
 *   dirección existentes (solo Banco Industrial → BI Club; BI Club solo →
 *   Banco Industrial, sin retiro de efectivo) no cambian. Ambos lados siguen
 *   en la misma transacción, con lock en orden de id.
 * - `void_bank_transfer`: rechaza anular una transferencia de BI Club
 *   registrada con la semántica anterior (entrada positiva / salida
 *   negativa), porque su inverso ya no tendría sentido
 *   (`LEGACY_CREDIT_LINE_TRANSFER`); se corrige con "Ajustar saldo".
 * - `save_bank_balance` (foto diaria del cierre): admite saldo negativo
 *   también para BI Club.
 *
 * Datos: si BI Club tiene hoy un saldo POSITIVO (semántica anterior = saldo
 * recibido de Banco Industrial), se lleva a Q0.00 con UN movimiento
 * AJUSTE_MANUAL auditado (saldo anterior/posterior, concepto y observación
 * con el valor previo). El historial previo queda intacto.
 */
export class BiClubCreditLine1760005700000 implements MigrationInterface {
  name = 'BiClubCreditLine1760005700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
        v_limit NUMERIC(14,2);
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

        IF v_bank.special_account = 'BI_CLUB' THEN
          -- Línea de crédito: -límite <= saldo <= 0, para todo tipo de movimiento.
          v_limit := COALESCE(v_bank.max_balance, 0);
          IF p_delta < 0 AND v_after < -v_limit THEN
            RAISE EXCEPTION 'CREDIT_LINE_LIMIT_EXCEEDED:%:%:%',
              p_movement_type, v_limit, GREATEST(v_limit + v_before, 0);
          END IF;
          IF p_delta > 0 AND v_after > 0 THEN
            IF v_before >= 0 THEN
              RAISE EXCEPTION 'CREDIT_LINE_NO_DEBT:%', p_movement_type;
            END IF;
            RAISE EXCEPTION 'CREDIT_LINE_OVERPAYMENT:%:%', p_movement_type, -v_before;
          END IF;
        ELSE
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
        v_source_delta NUMERIC(14,2);
        v_destination_delta NUMERIC(14,2);
      BEGIN
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
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

        -- Cada lado aplica su propia regla: la línea de crédito de BI Club
        -- disminuye al recibir (uso) y aumenta hacia cero al enviar (pago).
        v_source_delta := CASE WHEN v_source.special_account = 'BI_CLUB' THEN p_amount ELSE -p_amount END;
        v_destination_delta := CASE WHEN v_destination.special_account = 'BI_CLUB' THEN -p_amount ELSE p_amount END;

        PERFORM apply_bank_account_movement(
          p_source_bank_id, 'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA', v_source_delta,
          p_business_date, p_user_id, 'BANK_TRANSFER', v_transfer_id,
          p_reference_text, p_concept, NULL, p_destination_bank_id, NULL
        );
        PERFORM apply_bank_account_movement(
          p_destination_bank_id, 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA', v_destination_delta,
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

        -- Transferencia de BI Club registrada antes de la línea de crédito
        -- (entrada positiva / salida negativa): su inverso ya no aplica.
        IF EXISTS (
          SELECT 1 FROM bank_account_movements m
          JOIN banks b ON b.id = m.bank_id
          WHERE m.reference_type = 'BANK_TRANSFER' AND m.reference_id = p_transfer_id
            AND m.status = 'APLICADO'
            AND b.special_account = 'BI_CLUB'
            AND ((m.movement_type = 'TRANSFERENCIA_ENTRADA' AND m.amount > 0)
              OR (m.movement_type = 'TRANSFERENCIA_SALIDA' AND m.amount < 0))
        ) THEN
          RAISE EXCEPTION 'LEGACY_CREDIT_LINE_TRANSFER:%', p_transfer_id;
        END IF;

        v_reversed := reverse_bank_account_movements('BANK_TRANSFER', p_transfer_id, p_business_date, p_user_id, p_reason);
        IF v_reversed = 0 THEN
          RAISE EXCEPTION 'TRANSFER_ALREADY_VOIDED:%', p_transfer_id;
        END IF;
      END;
      $fn$;
    `);

    await queryRunner.query(saveBankBalanceSql(['GENESIS', 'BI_CLUB']));

    // Saldo inicial Q0.00: solo si hoy es positivo (semántica anterior).
    // Un movimiento auditado por cuenta; nunca una escritura silenciosa.
    await queryRunner.query(`
      SELECT apply_bank_account_movement(
        b.id, 'AJUSTE_MANUAL', 'AJUSTE_MANUAL', -b.final_balance,
        (now() AT TIME ZONE 'America/Guatemala')::date,
        COALESCE(b.updated_by, b.created_by),
        NULL, NULL, NULL,
        'Conversión de BI Club Empresarial a línea de crédito: saldo inicial Q0.00',
        'Saldo previo ' || b.final_balance::text
          || ' (semántica anterior: saldo recibido de Banco Industrial). Migración 1760005700000-BiClubCreditLine.',
        NULL, NULL
      )
      FROM banks b
      WHERE b.special_account = 'BI_CLUB' AND b.final_balance > 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaura las reglas de la versión anterior (AddCashWithdrawalToBankTransfers
    // / CreateBankAccountMovements). No revierte movimientos: el ajuste de
    // conversión y todo movimiento posterior quedan en el historial. Con un
    // saldo negativo en BI Club, la regla anterior rechazará nuevas salidas
    // hasta corregirlo con "Ajustar saldo".
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

        IF v_source.special_account = 'BI_CLUB' THEN
          IF p_destination_bank_id IS NULL THEN
            RAISE EXCEPTION 'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB';
          END IF;
          PERFORM 1 FROM banks WHERE id = p_destination_bank_id AND special_account = 'BANCO_INDUSTRIAL';
          IF NOT FOUND THEN
            RAISE EXCEPTION 'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB';
          END IF;
        END IF;

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

    await queryRunner.query(saveBankBalanceSql(['GENESIS']));
  }
}

/**
 * `save_bank_balance` — cuerpo idéntico al de `CreateBankAccountMovements`;
 * solo varía qué cuentas especiales admiten una foto diaria negativa.
 */
function saveBankBalanceSql(negativeAllowed: string[]): string {
  const allowed = negativeAllowed.map((value) => `'${value}'`).join(', ');
  return `
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

      IF v_final_balance < 0 AND COALESCE(v_bank.special_account, '') NOT IN (${allowed}) THEN
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
  `;
}
