import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Gates every Recargas write function behind `recharge_day_openings` being
 * open for that date — see `1759000000000-CreateRechargeDayOpenings`'s own
 * doc comment for the full day-lifecycle design. Each function below gets
 * `CREATE OR REPLACE` with exactly one new guard clause added
 * (`RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%'` when that date's
 * `recharge_day_openings.closed_at IS NOT NULL`); every other line is
 * byte-for-byte unchanged from the current, already-shipped version.
 *
 * This is the *sole* enforcement for `update_recharge_sale`/
 * `delete_recharge_sale` — those two use cases deliberately have no
 * application-layer pre-check today (see their own doc comments: relying
 * entirely on the SQL function's row lock avoids a TOCTOU gap), so the
 * guard is added here rather than retrofitting a pre-check that would
 * change that intentional design. The other four functions also get an
 * equivalent pre-check in their own use case (see the application-layer
 * changes in this same ticket) — this migration is defense-in-depth for
 * those four, exactly like every other stored-function/use-case pair in
 * this codebase.
 *
 * Deliberately does NOT gate `ensure_recharge_daily_balance` itself — it's
 * an internal helper called by the functions below (and by
 * `GET /recharges/daily`'s read path), never invoked directly by a write
 * a caller controls; gating each caller is sufficient and avoids gating a
 * read path that must keep working to show a closed day's own history.
 */
export class AddRechargeDayGateToWriteFunctions1759000100000 implements MigrationInterface {
  name = 'AddRechargeDayGateToWriteFunctions1759000100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_purchase(
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

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sale(
        p_recharge_type_id UUID,
        p_date DATE,
        p_phone_number VARCHAR,
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
        v_sale_id UUID;
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

        IF p_phone_number IS NULL OR length(trim(p_phone_number)) = 0 THEN
          RAISE EXCEPTION 'INVALID_PHONE_NUMBER:%', p_recharge_type_id;
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

        INSERT INTO recharge_sales
          (recharge_type_id, daily_balance_id, phone_number, amount, sale_date, created_by)
        VALUES
          (p_recharge_type_id, v_daily_balance_id, p_phone_number, p_amount, p_date, p_user_id)
        RETURNING id INTO v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_recharge_sale(
        p_id UUID,
        p_phone_number VARCHAR,
        p_amount NUMERIC,
        p_user_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
        v_date DATE;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT daily_balance_id, sale_date INTO v_daily_balance_id, v_date FROM recharge_sales WHERE id = p_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_SALE_NOT_FOUND:%', p_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = v_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_id;
        END IF;

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_SALE_LOCKED:%', p_id;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_id;
        END IF;

        IF p_phone_number IS NULL OR length(trim(p_phone_number)) = 0 THEN
          RAISE EXCEPTION 'INVALID_PHONE_NUMBER:%', p_id;
        END IF;

        UPDATE recharge_sales
        SET phone_number = p_phone_number,
            amount = p_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = p_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION delete_recharge_sale(
        p_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
        v_date DATE;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT daily_balance_id, sale_date INTO v_daily_balance_id, v_date FROM recharge_sales WHERE id = p_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_SALE_NOT_FOUND:%', p_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = v_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_id;
        END IF;

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_SALE_LOCKED:%', p_id;
        END IF;

        DELETE FROM recharge_sales WHERE id = p_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_final_balance(
        p_daily_balance_id UUID,
        p_final_balance NUMERIC,
        p_user_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance NUMERIC(12,2);
        v_date DATE;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT daily_balance, date INTO v_daily_balance, v_date
        FROM recharge_daily_balances
        WHERE id = p_daily_balance_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAILY_BALANCE_NOT_FOUND:%', p_daily_balance_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = v_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_daily_balance_id;
        END IF;

        IF p_final_balance IS NULL OR p_final_balance < 0 THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_daily_balance_id;
        END IF;

        IF p_final_balance > v_daily_balance THEN
          RAISE EXCEPTION 'FINAL_BALANCE_EXCEEDS_DAILY:%', p_daily_balance_id;
        END IF;

        UPDATE recharge_daily_balances
        SET final_balance = p_final_balance,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = p_daily_balance_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sales_closure(
        p_date DATE,
        p_total_collected NUMERIC,
        p_user_id UUID,
        p_is_admin BOOLEAN
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_closure_id UUID;
        v_total_sales NUMERIC(12,2) := 0;
        v_type_sales NUMERIC(12,2);
        v_result NUMERIC(12,2);
        v_row RECORD;
        v_sequence INTEGER;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        IF p_total_collected IS NULL OR p_total_collected < 0 THEN
          RAISE EXCEPTION 'INVALID_TOTAL_COLLECTED:%', p_date;
        END IF;

        v_sequence := NULL;

        FOR v_row IN
          SELECT recharge_type_id, id AS daily_balance_id, final_balance, sequence
          FROM recharge_daily_balances
          WHERE id IN (
            SELECT DISTINCT ON (recharge_type_id) id
            FROM recharge_daily_balances
            WHERE date = p_date
            ORDER BY recharge_type_id, sequence DESC
          )
          FOR UPDATE
        LOOP
          IF v_row.final_balance IS NULL THEN
            RAISE EXCEPTION 'PENDING_TYPE_CLOSURE:%', v_row.recharge_type_id;
          END IF;

          SELECT COALESCE(SUM(amount), 0) INTO v_type_sales
          FROM recharge_sales
          WHERE daily_balance_id = v_row.daily_balance_id;

          v_total_sales := v_total_sales + v_type_sales;
          v_sequence := v_row.sequence;
        END LOOP;

        IF v_sequence IS NULL THEN
          v_sequence := 1;
        END IF;

        v_result := v_total_sales - p_total_collected;

        BEGIN
          INSERT INTO recharge_sales_closures
            (date, sequence, total_sales, total_collected, result, created_by)
          VALUES
            (p_date, v_sequence, v_total_sales, p_total_collected, v_result, p_user_id)
          RETURNING id INTO v_closure_id;

          FOR v_row IN
            SELECT DISTINCT ON (recharge_type_id) recharge_type_id, final_balance
            FROM recharge_daily_balances
            WHERE date = p_date AND sequence = v_sequence
          LOOP
            INSERT INTO recharge_daily_balances
              (recharge_type_id, date, sequence, previous_balance, daily_balance, final_balance, created_by)
            VALUES
              (v_row.recharge_type_id, p_date, v_sequence + 1, v_row.final_balance, v_row.final_balance, NULL, p_user_id);
          END LOOP;
        EXCEPTION WHEN unique_violation THEN
          IF NOT p_is_admin THEN
            RAISE EXCEPTION 'SALES_CLOSURE_EDIT_FORBIDDEN:%', p_date;
          END IF;

          UPDATE recharge_sales_closures
          SET total_sales = v_total_sales,
              total_collected = p_total_collected,
              result = v_result,
              updated_by = p_user_id,
              updated_at = now()
          WHERE date = p_date AND sequence = v_sequence
          RETURNING id INTO v_closure_id;
        END;

        RETURN v_closure_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // No functional downgrade provided — reverting would mean reintroducing
    // the exact gap this migration closes (writes bypassing a closed day),
    // the same "no downgrade for a correctness fix" precedent already
    // established by this project (see e.g.
    // `OnlySyncBanksFinalBalanceForLatestDate`/
    // `FixLaterDayCheckIncludesReopened`). Rolling back
    // `1759000000000-CreateRechargeDayOpenings` (which this migration
    // depends on) is the only supported way to remove this feature.
  }
}
