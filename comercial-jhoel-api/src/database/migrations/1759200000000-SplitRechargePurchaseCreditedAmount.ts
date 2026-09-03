import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Registrar Compra" separa el monto en dos conceptos: `amount` (ya
 * existente, ahora "monto de compra" — puramente informativo, NUNCA afecta
 * el saldo) y el nuevo `credited_amount` ("monto acreditado" — el único
 * valor que suma a `recharge_daily_balances.daily_balance`). Puramente
 * aditivo: no se renombra ni se elimina ninguna columna existente, y todo
 * registro histórico se conserva intacto.
 *
 * Backfill: para cada fila ya existente, `credited_amount = amount` — esto
 * es exacto, no un placeholder arbitrario, porque antes de este ticket el
 * monto completo de cada compra SÍ era lo que se acreditaba al saldo (no
 * existía la distinción). El saldo (`daily_balance`) de cada ciclo ya
 * refleja exactamente esa suma histórica, así que este backfill no cambia
 * ningún cálculo pasado.
 *
 * `register_recharge_purchase` cambia de firma (4 parámetros → 5) — un
 * `CREATE OR REPLACE` con distinto número de parámetros crearía un segundo
 * overload en vez de reemplazar la función, así que se elimina
 * explícitamente la firma vieja antes de crear la nueva. El cuerpo
 * conserva sin cambios las validaciones de tipo/día-cerrado ya existentes
 * (ver `1759000100000-AddRechargeDayGateToWriteFunctions`); lo único nuevo
 * es validar ambos montos y sumar `p_credited_amount` (nunca
 * `p_purchase_amount`) a `daily_balance`. El módulo de Cuadre de Recargas
 * (`register_recharge_sales_closure`, `recharge_sales_closures`) no se
 * toca — nunca lee `recharge_purchases`, solo `daily_balance`/
 * `final_balance`, que siguen calculándose exactamente igual.
 */
export class SplitRechargePurchaseCreditedAmount1759200000000 implements MigrationInterface {
  name = 'SplitRechargePurchaseCreditedAmount1759200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE recharge_purchases ADD COLUMN credited_amount NUMERIC(12,2)`,
    );
    await queryRunner.query(
      `UPDATE recharge_purchases SET credited_amount = amount WHERE credited_amount IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE recharge_purchases ALTER COLUMN credited_amount SET NOT NULL`,
    );

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_recharge_purchase(UUID, DATE, NUMERIC, UUID)`,
    );

    await queryRunner.query(`
      CREATE FUNCTION register_recharge_purchase(
        p_recharge_type_id UUID,
        p_date DATE,
        p_purchase_amount NUMERIC,
        p_credited_amount NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT id, is_active INTO v_type FROM recharge_types WHERE id = p_recharge_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_NOT_FOUND:%', p_recharge_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_INACTIVE:%', p_recharge_type_id;
        END IF;

        IF p_purchase_amount IS NULL OR p_purchase_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_recharge_type_id;
        END IF;

        IF p_credited_amount IS NULL OR p_credited_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_recharge_type_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        v_daily_balance_id := ensure_recharge_daily_balance(p_recharge_type_id, p_date, p_user_id);

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', v_daily_balance_id;
        END IF;

        INSERT INTO recharge_purchases
          (recharge_type_id, daily_balance_id, amount, credited_amount, purchase_date, created_by)
        VALUES
          (p_recharge_type_id, v_daily_balance_id, p_purchase_amount, p_credited_amount, p_date, p_user_id);

        UPDATE recharge_daily_balances
        SET daily_balance = daily_balance + p_credited_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_balance_id;

        RETURN v_daily_balance_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_recharge_purchase(UUID, DATE, NUMERIC, NUMERIC, UUID)`,
    );

    await queryRunner.query(`
      CREATE FUNCTION register_recharge_purchase(
        p_recharge_type_id UUID,
        p_date DATE,
        p_amount NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT id, is_active INTO v_type FROM recharge_types WHERE id = p_recharge_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_NOT_FOUND:%', p_recharge_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_INACTIVE:%', p_recharge_type_id;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_recharge_type_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        v_daily_balance_id := ensure_recharge_daily_balance(p_recharge_type_id, p_date, p_user_id);

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', v_daily_balance_id;
        END IF;

        INSERT INTO recharge_purchases
          (recharge_type_id, daily_balance_id, amount, purchase_date, created_by)
        VALUES
          (p_recharge_type_id, v_daily_balance_id, p_amount, p_date, p_user_id);

        UPDATE recharge_daily_balances
        SET daily_balance = daily_balance + p_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_balance_id;

        RETURN v_daily_balance_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      `ALTER TABLE recharge_purchases DROP COLUMN credited_amount`,
    );
  }
}
