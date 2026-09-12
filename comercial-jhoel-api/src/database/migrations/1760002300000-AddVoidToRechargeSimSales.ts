import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Revertir" for the by-quantity "Vender SIM" quick-sale flow
 * (`recharge_sim_sales`), which never had any void/revert mechanism since it
 * was first built — a real, pre-existing gap, not a regression from the
 * later `recharge_sim_sale_registrations` (identity-capture) feature. Same
 * `is_voided`/`voided_at`/`voided_by`/`void_reason` + all-or-nothing CHECK
 * pattern as `recharge_purchases`/`bank_deposit_operations`/`sales` — never a
 * physical `DELETE`. Purely additive: every pre-existing row defaults to
 * `is_voided = false`, byte-identical to today's actual behavior.
 *
 * `void_recharge_sim_sale()` mirrors `void_recharge_purchase()`'s structure
 * (reason required, row lock, not-found/already-voided checks, restores
 * stock) with one deliberate omission and one deliberate addition:
 *   - Omission: no cycle/`final_balance`-style lock check — SIM stock has no
 *     cuadre cycle/sequence concept at all (confirmed earlier in this same
 *     module's own development), so the only gate is whether the sale's own
 *     `recharge_day_openings` day is closed.
 *   - Addition: a sale that already has an active (non-voided)
 *     `recharge_sim_sale_registrations` row is refused
 *     (`SIM_SALE_HAS_REGISTRATION`) — that sale belongs to the *other*,
 *     identity-capture flow's own void path ("Administrar Ventas de SIM"),
 *     which already restores stock when its registration is anulada; voiding
 *     the same physical sale a second time through this path would double-
 *     restore stock. In practice the new "administrar ventas rápidas" listing
 *     only ever shows sales with no registration attached, but the SQL
 *     function itself never trusts that filter alone.
 *
 * `register_recharge_sales_closure` (same 4-param signature, bare
 * `CREATE OR REPLACE`) is re-issued so a voided by-quantity sale correctly
 * drops out of "Total Recaudado"/the cuadre's `total_sales` — the CASE
 * expression's previous `ELSE rss.total_amount` (any by-quantity sale, no
 * matter its state) becomes conditional on `rss.is_voided = false` too.
 */
export class AddVoidToRechargeSimSales1760002300000
  implements MigrationInterface
{
  name = 'AddVoidToRechargeSimSales1760002300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_sim_sales ADD COLUMN is_voided boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_sim_sales ADD COLUMN voided_at timestamptz NULL
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_sim_sales ADD COLUMN voided_by uuid NULL REFERENCES users(id) ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_sim_sales ADD COLUMN void_reason varchar(255) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_sim_sales
      ADD CONSTRAINT CHK_recharge_sim_sales_void_consistency CHECK (
        (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
        OR
        (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_recharge_sim_sale(
        p_sale_id UUID,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale RECORD;
        v_day_closed_at TIMESTAMPTZ;
        v_has_active_registration BOOLEAN;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, daily_stock_id, quantity, sale_date, is_voided
        INTO v_sale
        FROM recharge_sim_sales
        WHERE id = p_sale_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'SIM_SALE_NOT_FOUND:%', p_sale_id;
        END IF;

        IF v_sale.is_voided THEN
          RAISE EXCEPTION 'SIM_SALE_ALREADY_VOIDED:%', p_sale_id;
        END IF;

        SELECT EXISTS(
          SELECT 1 FROM recharge_sim_sale_registrations
          WHERE recharge_sim_sale_id = p_sale_id AND is_voided = false
        ) INTO v_has_active_registration;

        IF v_has_active_registration THEN
          RAISE EXCEPTION 'SIM_SALE_HAS_REGISTRATION:%', p_sale_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at
        FROM recharge_day_openings
        WHERE date = v_sale.sale_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_sale_id;
        END IF;

        UPDATE recharge_sim_sales
        SET is_voided = true,
            voided_at = now(),
            voided_by = p_user_id,
            void_reason = trim(p_reason)
        WHERE id = p_sale_id;

        UPDATE recharge_sim_daily_stock
        SET current_stock = current_stock + v_sale.quantity,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_sale.daily_stock_id;

        RETURN p_sale_id;
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
        v_sim_sales_total NUMERIC(12,2) := 0;
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

        -- A by-quantity sale (no registration) now also drops out once
        -- voided (rss.is_voided = false in the fallback branch) — the
        -- registration-flow branches above are unchanged.
        SELECT COALESCE(SUM(
          CASE
            WHEN r.id IS NOT NULL AND r.is_voided = false THEN r.sale_price
            WHEN r.id IS NOT NULL AND r.is_voided = true THEN 0
            WHEN r.id IS NULL AND rss.is_voided = false THEN rss.total_amount
            ELSE 0
          END
        ), 0) INTO v_sim_sales_total
        FROM recharge_sim_sales rss
        LEFT JOIN recharge_sim_sale_registrations r ON r.recharge_sim_sale_id = rss.id
        WHERE rss.sale_date = p_date;

        v_total_sales := v_total_sales + v_sim_sales_total;

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

  public async down(queryRunner: QueryRunner): Promise<void> {
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
        v_sim_sales_total NUMERIC(12,2) := 0;
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

        SELECT COALESCE(SUM(
          CASE
            WHEN r.id IS NOT NULL AND r.is_voided = false THEN r.sale_price
            WHEN r.id IS NOT NULL AND r.is_voided = true THEN 0
            ELSE rss.total_amount
          END
        ), 0) INTO v_sim_sales_total
        FROM recharge_sim_sales rss
        LEFT JOIN recharge_sim_sale_registrations r ON r.recharge_sim_sale_id = rss.id
        WHERE rss.sale_date = p_date;

        v_total_sales := v_total_sales + v_sim_sales_total;

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

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_recharge_sim_sale(UUID, UUID, VARCHAR)',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_sim_sales DROP CONSTRAINT CHK_recharge_sim_sales_void_consistency',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_sim_sales DROP COLUMN void_reason',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_sim_sales DROP COLUMN voided_by',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_sim_sales DROP COLUMN voided_at',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_sim_sales DROP COLUMN is_voided',
    );
  }
}
