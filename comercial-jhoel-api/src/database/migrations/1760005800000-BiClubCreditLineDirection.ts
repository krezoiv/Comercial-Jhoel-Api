import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Corrige el SENTIDO de la línea de crédito de BI Club Empresarial
 * (`BiClubCreditLine`, 1760005700000). El flujo real del negocio es:
 *
 *   Uso de la línea:  BI Club → Banco Industrial
 *     BI Club           saldo − monto   (nuevo ≥ −límite)
 *     Banco Industrial  saldo + monto   (recibe el dinero)
 *   Pago (fin del día): Banco Industrial → BI Club
 *     Banco Industrial  saldo − monto   (regla normal: saldo suficiente)
 *     BI Club           saldo + monto   (nuevo ≤ 0; sin deuda se rechaza)
 *
 * Es decir, en una transferencia TODAS las cuentas usan la regla normal
 * (origen resta, destino suma); lo único especial de BI Club son sus
 * límites, que ya aplica `apply_bank_account_movement` (sin cambios aquí).
 *
 * Solo `CREATE OR REPLACE` de dos funciones con la misma firma; ninguna
 * tabla ni fila cambia:
 * - `register_bank_transfer`: se retira la inversión de signo de BI Club.
 *   Reglas de dirección sin cambios (BI Club solo ↔ Banco Industrial, sin
 *   retiro de efectivo desde BI Club).
 * - `void_bank_transfer`: el bloqueo de anulación pasa a las transferencias
 *   registradas con el sentido invertido de 1760005700000 (entrada negativa
 *   / salida positiva en BI Club), cuyo inverso ya no aplica.
 */
export class BiClubCreditLineDirection1760005800000 implements MigrationInterface {
  name = 'BiClubCreditLineDirection1760005800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(registerBankTransferSql(false));
    await queryRunner.query(voidBankTransferSql('new'));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaura el sentido de 1760005700000. No revierte movimientos.
    await queryRunner.query(registerBankTransferSql(true));
    await queryRunner.query(voidBankTransferSql('previous'));
  }
}

/**
 * `register_bank_transfer`; `invertBiClub = true` es la versión de
 * 1760005700000 (BI Club resta al recibir y suma al enviar).
 */
function registerBankTransferSql(invertBiClub: boolean): string {
  const deltas = invertBiClub
    ? `
        v_source_delta := CASE WHEN v_source.special_account = 'BI_CLUB' THEN p_amount ELSE -p_amount END;
        v_destination_delta := CASE WHEN v_destination.special_account = 'BI_CLUB' THEN -p_amount ELSE p_amount END;`
    : `
        -- Origen resta y destino suma, también para BI Club (usar la línea
        -- = enviar a Banco Industrial; pagarla = recibir de Banco Industrial).
        -- Sus límites (-límite ≤ saldo ≤ 0) los aplica apply_bank_account_movement.
        v_source_delta := -p_amount;
        v_destination_delta := p_amount;`;
  return `
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
${deltas}

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
  `;
}

/**
 * `void_bank_transfer`. `new`: bloquea las transferencias de BI Club con el
 * sentido invertido de 1760005700000 (entrada negativa / salida positiva).
 * `previous`: la versión de 1760005700000 (bloqueaba el signo contrario).
 */
function voidBankTransferSql(version: 'new' | 'previous'): string {
  const inverted =
    version === 'new'
      ? `((m.movement_type = 'TRANSFERENCIA_ENTRADA' AND m.amount < 0)
              OR (m.movement_type = 'TRANSFERENCIA_SALIDA' AND m.amount > 0))`
      : `((m.movement_type = 'TRANSFERENCIA_ENTRADA' AND m.amount > 0)
              OR (m.movement_type = 'TRANSFERENCIA_SALIDA' AND m.amount < 0))`;
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
