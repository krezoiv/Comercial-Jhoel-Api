import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * BI Club Empresarial — REGLA DEFINITIVA (reemplaza el modelo de
 * `1760005900000-BiClubAvailableCredit`): el saldo es la DEUDA de la línea.
 *
 *   Q0.00     = no se debe nada (Q75,000 disponibles)
 *   −Q50,000  = se deben Q50,000 (disponible = límite + saldo = Q25,000)
 *   Rango: −max_balance ≤ saldo ≤ 0
 *
 *   Uso:  BI Club → Banco Industrial     BI Club − monto   Industrial + monto
 *   Pago: Banco Industrial → BI Club     Industrial − monto  BI Club + monto
 *
 * En una transferencia todas las cuentas usan la regla normal (origen resta,
 * destino suma) — `register_bank_transfer` ya lo hace desde 1760005800000 y
 * no cambia aquí. Solo `CREATE OR REPLACE` (misma firma):
 *
 * - `apply_bank_account_movement`: se retira la inversión de signo de BI Club
 *   que agregó 1760005900000; quedan sus límites con los códigos
 *   `CREDIT_LINE_LIMIT_EXCEEDED` (saldo < −límite), `CREDIT_LINE_NO_DEBT`
 *   (pago sin deuda) y `CREDIT_LINE_OVERPAYMENT` (pago > deuda), para todo
 *   tipo de movimiento. Lock `FOR UPDATE` sin cambios.
 * - `void_bank_transfer`: bloquea anular transferencias de BI Club con signo
 *   contrario a esta regla (entrada negativa / salida positiva: las de
 *   1760005700000 y 1760005900000).
 *
 * Datos: si 1760005900000 llegó a aplicarse (existe su ajuste de "línea
 * disponible completa" sobre BI Club), el saldo actual está expresado como
 * −disponible; se convierte a deuda con UN movimiento AJUSTE_MANUAL auditado:
 *   deuda = −(límite + saldo_modelo_A)   (−75,000 → 0; 0 → −75,000)
 * Si ese ajuste no existe, el saldo ya está en esta regla y no se toca.
 */
export class BiClubDebtModel1760006000000 implements MigrationInterface {
  name = 'BiClubDebtModel1760006000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(applyBankAccountMovementSql(false));
    await queryRunner.query(voidBankTransferSql(false));

    await queryRunner.query(`
      SELECT apply_bank_account_movement(
        b.id, 'AJUSTE_MANUAL', 'AJUSTE_MANUAL',
        (-(b.max_balance + b.final_balance)) - b.final_balance,
        (now() AT TIME ZONE 'America/Guatemala')::date,
        COALESCE(b.updated_by, b.created_by),
        NULL, NULL, NULL,
        'BI Club Empresarial: saldo convertido a deuda de la línea (Q0.00 = no se debe nada)',
        'Saldo previo ' || b.final_balance::text
          || ' expresado como −disponible (migración 1760005900000). Deuda = −(límite + saldo previo). Migración 1760006000000-BiClubDebtModel.',
        NULL, NULL
      )
      FROM banks b
      WHERE b.special_account = 'BI_CLUB'
        AND b.max_balance IS NOT NULL
        AND (-(b.max_balance + b.final_balance)) <> b.final_balance
        -- Idempotente: solo si la última marca de conversión sobre BI Club es
        -- la de 1760005900000 (si ya existe una de esta migración posterior,
        -- el saldo ya está expresado como deuda y no se vuelve a convertir).
        AND (
          SELECT m.observation FROM bank_account_movements m
          WHERE m.bank_id = b.id
            AND m.movement_type = 'AJUSTE_MANUAL'
            AND (m.observation LIKE '%Migración 1760005900000-BiClubAvailableCredit%'
              OR m.observation LIKE '%Migración 1760006000000-BiClubDebtModel%')
          ORDER BY m.sequence DESC
          LIMIT 1
        ) LIKE '%Migración 1760005900000-BiClubAvailableCredit%'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Vuelve a las funciones de 1760005900000. No revierte movimientos.
    await queryRunner.query(applyBankAccountMovementSql(true));
    await queryRunner.query(voidBankTransferSql(true));
  }
}

/**
 * `availableModel = false`: regla definitiva (saldo = deuda, sin inversión).
 * `true`: versión de 1760005900000 (saldo = −disponible, delta invertido).
 */
function applyBankAccountMovementSql(availableModel: boolean): string {
  const effectiveDelta = availableModel
    ? `
      IF v_bank.special_account = 'BI_CLUB'
         AND p_movement_type NOT IN ('AJUSTE_MANUAL', 'ANULACION', 'SALDO_INICIAL') THEN
        v_delta := -p_delta;
      ELSE
        v_delta := p_delta;
      END IF;`
    : `
      v_delta := p_delta;`;
  const creditLineChecks = availableModel
    ? `
        IF v_delta > 0 AND v_after > 0 THEN
          IF v_before >= 0 THEN
            RAISE EXCEPTION 'CREDIT_LINE_NO_AVAILABLE:%', p_movement_type;
          END IF;
          RAISE EXCEPTION 'CREDIT_LINE_AVAILABLE_EXCEEDED:%:%', p_movement_type, -v_before;
        END IF;
        IF v_delta < 0 AND v_after < -v_limit THEN
          RAISE EXCEPTION 'CREDIT_LINE_PAYMENT_EXCEEDED:%:%:%',
            p_movement_type, v_limit, GREATEST(v_limit + v_before, 0);
        END IF;`
    : `
        -- Uso de la línea: nunca por debajo de −límite.
        IF v_delta < 0 AND v_after < -v_limit THEN
          RAISE EXCEPTION 'CREDIT_LINE_LIMIT_EXCEEDED:%:%:%',
            p_movement_type, v_limit, GREATEST(v_limit + v_before, 0);
        END IF;
        -- Pago de la línea: nunca más que la deuda (el saldo no queda positivo).
        IF v_delta > 0 AND v_after > 0 THEN
          IF v_before >= 0 THEN
            RAISE EXCEPTION 'CREDIT_LINE_NO_DEBT:%', p_movement_type;
          END IF;
          RAISE EXCEPTION 'CREDIT_LINE_OVERPAYMENT:%:%', p_movement_type, -v_before;
        END IF;`;
  return `
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
      v_delta NUMERIC(14,2);
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
${effectiveDelta}

      v_before := v_bank.final_balance;
      v_after := v_before + v_delta;

      IF v_bank.special_account = 'BI_CLUB' THEN
        -- Línea de crédito: -límite <= saldo <= 0, para todo tipo de movimiento.
        v_limit := COALESCE(v_bank.max_balance, 0);${creditLineChecks}
      ELSE
        IF v_delta < 0 AND v_after < 0 THEN
          IF v_bank.special_account IS DISTINCT FROM 'GENESIS'
             OR p_movement_type IN ('TRANSFERENCIA_SALIDA', 'RETIRO_EFECTIVO') THEN
            RAISE EXCEPTION 'INSUFFICIENT_BALANCE:%', p_movement_type;
          END IF;
        END IF;

        IF v_delta > 0
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
        p_bank_id, p_movement_type, p_origin, v_delta, v_before, v_after,
        p_business_date, p_user_id, p_reference_type, p_reference_id,
        NULLIF(btrim(p_reference_text), ''), NULLIF(btrim(p_concept), ''),
        NULLIF(btrim(p_observation), ''), p_counterpart_bank_id, p_reversal_of_id
      )
      RETURNING id INTO v_movement_id;

      RETURN v_movement_id;
    END;
    $fn$;
  `;
}

/**
 * `availableModel = false`: bloquea anular transferencias de BI Club con
 * entrada negativa / salida positiva (signo contrario a la regla definitiva).
 * `true`: versión de 1760005900000.
 */
function voidBankTransferSql(availableModel: boolean): string {
  const inverted = availableModel
    ? `((m.movement_type = 'TRANSFERENCIA_ENTRADA' AND m.amount > 0)
              OR (m.movement_type = 'TRANSFERENCIA_SALIDA' AND m.amount < 0))`
    : `((m.movement_type = 'TRANSFERENCIA_ENTRADA' AND m.amount < 0)
              OR (m.movement_type = 'TRANSFERENCIA_SALIDA' AND m.amount > 0))`;
  return `
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

      -- Transferencia de BI Club registrada con un sentido que ya no aplica:
      -- su inverso no tendría sentido; se corrige con "Ajustar saldo".
      IF EXISTS (
        SELECT 1 FROM bank_account_movements m
        JOIN banks b ON b.id = m.bank_id
        WHERE m.reference_type = 'BANK_TRANSFER' AND m.reference_id = p_transfer_id
          AND m.status = 'APLICADO'
          AND b.special_account = 'BI_CLUB'
          AND ${inverted}
      ) THEN
        RAISE EXCEPTION 'LEGACY_CREDIT_LINE_TRANSFER:%', p_transfer_id;
      END IF;

      v_reversed := reverse_bank_account_movements('BANK_TRANSFER', p_transfer_id, p_business_date, p_user_id, p_reason);
      IF v_reversed = 0 THEN
        RAISE EXCEPTION 'TRANSFER_ALREADY_VOIDED:%', p_transfer_id;
      END IF;
    END;
    $fn$;
  `;
}
