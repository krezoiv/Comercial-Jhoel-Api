import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Corrige un defecto real de la migración anterior
 * (`SyncBanksFinalBalanceOnSave`): esa versión de `save_bank_balance`
 * actualizaba `banks.final_balance` (el valor "actual" que Sistema →
 * Bancos y Cuadre Agentes → Resumen de Bancos leen) sin importar qué
 * fecha se estuviera guardando. Eso funciona bien cuando se guarda el
 * día más reciente, pero corrompe el valor "actual" cuando se guarda
 * (o corrige) una fecha *pasada*, anterior a un cuadre ya existente para
 * ese banco — se descubrió exactamente así, probando esta ticket con una
 * fecha de prueba distinta a hoy.
 *
 * La corrección: solo sincronizar `banks.final_balance` cuando la fecha
 * que se está guardando es la más reciente conocida para ese banco (no
 * existe ningún otro `bank_balances` posterior para el mismo `bank_id`).
 * Guardar una fecha pasada sigue actualizando el histórico normalmente,
 * pero ya no toca el valor "actual" si un día más reciente ya lo definió.
 *
 * Puramente aditiva — `CREATE OR REPLACE FUNCTION` sobre la misma firma,
 * sin tocar tablas ni filas existentes.
 */
export class OnlySyncBanksFinalBalanceForLatestDate1758500000000 implements MigrationInterface {
  name = 'OnlySyncBanksFinalBalanceForLatestDate1758500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
        v_balance_id UUID;
      BEGIN
        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_OPERATION_DATE:%', p_bank_id;
        END IF;

        IF p_final_balance IS NULL OR p_final_balance < 0 THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_bank_id;
        END IF;

        SELECT id, is_active, previous_balance INTO v_bank FROM banks WHERE id = p_bank_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'BANK_INACTIVE:%', p_bank_id;
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
        VALUES (p_bank_id, p_operation_date, v_previous_balance, p_final_balance, p_user_id)
        ON CONFLICT (bank_id, operation_date)
        DO UPDATE SET
          previous_balance = EXCLUDED.previous_balance,
          final_balance = EXCLUDED.final_balance,
          user_id = EXCLUDED.user_id,
          updated_at = now()
        RETURNING id INTO v_balance_id;

        -- Solo sincroniza el valor "actual" si esta es la fecha más
        -- reciente conocida para este banco — una corrección retroactiva
        -- (fecha pasada) nunca debe pisar un valor ya definido por un día
        -- posterior real.
        IF NOT EXISTS (
          SELECT 1 FROM bank_balances
          WHERE bank_id = p_bank_id AND operation_date > p_operation_date
        ) THEN
          UPDATE banks SET final_balance = p_final_balance, updated_at = now() WHERE id = p_bank_id;
        END IF;

        RETURN v_balance_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
        v_balance_id UUID;
      BEGIN
        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_OPERATION_DATE:%', p_bank_id;
        END IF;

        IF p_final_balance IS NULL OR p_final_balance < 0 THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_bank_id;
        END IF;

        SELECT id, is_active, previous_balance INTO v_bank FROM banks WHERE id = p_bank_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'BANK_INACTIVE:%', p_bank_id;
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
        VALUES (p_bank_id, p_operation_date, v_previous_balance, p_final_balance, p_user_id)
        ON CONFLICT (bank_id, operation_date)
        DO UPDATE SET
          previous_balance = EXCLUDED.previous_balance,
          final_balance = EXCLUDED.final_balance,
          user_id = EXCLUDED.user_id,
          updated_at = now()
        RETURNING id INTO v_balance_id;

        UPDATE banks SET final_balance = p_final_balance, updated_at = now() WHERE id = p_bank_id;

        RETURN v_balance_id;
      END;
      $fn$;
    `);
  }
}
