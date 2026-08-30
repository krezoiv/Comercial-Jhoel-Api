import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Guardar Cambios" (Agentes Bancarios → Bancos) was only ever upserting
 * `bank_balances` (the daily cuadre history) — `banks.final_balance` (the
 * static reference value Sistema → Bancos and the Cuadre Agentes →
 * "Resumen de Bancos" summary read) was never touched by it. This is
 * exactly the ticket's own explicit requirement ("actualizar el saldo
 * correspondiente del banco en la tabla banks... Actualizar el
 * final_balance correspondiente"), and the concrete source of the
 * "guardé pero no veo el cambio" confusion — a save was landing in
 * `bank_balances` correctly, but whoever checked `banks.final_balance`
 * directly (or the Cuadre Agentes summary, which reads that same column)
 * never saw it move.
 *
 * Purely additive: `CREATE OR REPLACE FUNCTION` on the exact same
 * `save_bank_balance` signature already in use — no table/column
 * changes, no existing row touched by this migration itself. The one new
 * statement (`UPDATE banks SET final_balance = ...`) runs inside the same
 * transaction/row lock the function already takes on `banks` via its
 * `SELECT ... FOR UPDATE`, so this stays exactly as atomic as before: a
 * `bank_balances` upsert and its matching `banks.final_balance` update
 * either both happen or neither does.
 *
 * Deliberately unconditional on `p_operation_date` — a save for a
 * back-dated correction still overwrites `banks.final_balance`, matching
 * the ticket's own date-agnostic "Guardar Cambios" examples exactly. If a
 * future ticket needs backdated saves to leave the "current" reference
 * value alone, that's a deliberate follow-up rule to add, not an
 * oversight here.
 */
export class SyncBanksFinalBalanceOnSave1758400000000
  implements MigrationInterface
{
  name = 'SyncBanksFinalBalanceOnSave1758400000000';

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

        UPDATE banks SET final_balance = p_final_balance, updated_at = now() WHERE id = p_bank_id;

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

        RETURN v_balance_id;
      END;
      $fn$;
    `);
  }
}
