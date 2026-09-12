import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Venta de SIM con registro de identidad" — a per-unit compliance record
 * layered on top of the EXISTING, already-live "Venta de SIM" feature
 * (`CreateRechargeSims1759300000000`): that feature sells physical SIM
 * inventory by quantity (`recharge_sim_sales`, no identity capture). This
 * migration does NOT replace or duplicate it — both flows keep working
 * side by side (confirmed with the user): the quick by-quantity sale stays
 * for cases where no identity registration is needed, and this new,
 * detailed flow is for when it is. A detailed sale always registers
 * exactly ONE physical SIM (`recharge_sim_sales.quantity = 1`), created by
 * `RegisterRechargeSimSaleWithRegistrationUseCase` in the same transaction
 * as this registration row — every physical unit sold this way needs its
 * own número de SIM/DPI, so quantity > 1 was never a fit for this table.
 *
 * `recharge_sim_dpi_images` holds the actual photo bytes, in its own table
 * (never inline on the sale row, per the user's explicit security
 * requirement) — see this migration's own doc comment further down for why
 * Postgres BYTEA, not S3/disk, is the correct choice given this codebase's
 * actual infrastructure (no file-storage system exists anywhere in this
 * project, and the production API container has no persistent volume — a
 * disk-written file would not survive a redeploy). The image is NEVER
 * served by a public URL — only through an authenticated backend endpoint
 * (`GET /recharges/sims/sale-registrations/:id/dpi-image`) that streams
 * these bytes directly, gated by the same `JwtAuthGuard` as every other
 * route in this module.
 *
 * Void, never edit/delete — same "anular con motivo, nunca borrar" pattern
 * this codebase already uses for Purchases/Sales/Bank Deposits/Recharge
 * Purchases (confirmed with the user for this feature specifically): the
 * fix for a wrong registration is anular + registrar de nuevo, never an
 * in-place edit that could desync the Total Recaudado.
 */
export class AddRechargeSimSaleRegistrations1760002200000
  implements MigrationInterface
{
  name = 'AddRechargeSimSaleRegistrations1760002200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE recharge_sim_dpi_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_data BYTEA NOT NULL,
        mime_type VARCHAR(50) NOT NULL,
        size_bytes INTEGER NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE recharge_sim_sale_registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recharge_sim_sale_id UUID NOT NULL REFERENCES recharge_sim_sales(id) ON DELETE RESTRICT,
        sim_number VARCHAR(50) NOT NULL,
        sku VARCHAR(64) NOT NULL,
        client_dpi VARCHAR(20) NOT NULL,
        client_id UUID NULL REFERENCES clients(id) ON DELETE RESTRICT,
        sale_price NUMERIC(12,2) NOT NULL,
        sale_date DATE NOT NULL,
        dpi_image_id UUID NULL REFERENCES recharge_sim_dpi_images(id) ON DELETE RESTRICT,
        is_voided BOOLEAN NOT NULL DEFAULT false,
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT CHK_recharge_sim_sale_registrations_void_consistency CHECK (
          (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR
          (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_recharge_sim_sale_registrations_sale_date
      ON recharge_sim_sale_registrations (sale_date)
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_recharge_sim_sale_registrations_recharge_sim_sale_id
      ON recharge_sim_sale_registrations (recharge_sim_sale_id)
    `);

    // register_recharge_sim_sale_unit: a single-unit (quantity always 1)
    // variant of the existing register_recharge_sim_sale — same stock
    // check/decrement/day-gate logic, but RETURNS the new
    // recharge_sim_sales.id (never daily_stock_id) so the caller can link a
    // recharge_sim_sale_registrations row to it in the same transaction.
    // Deliberately a new function, not a change to register_recharge_sim_sale
    // itself: that function's existing callers (the quick by-quantity sale,
    // still fully in use — see this migration's own top doc comment) already
    // depend on it returning daily_stock_id; changing that return value
    // would be a breaking change to already-working, already-tested code for
    // zero benefit, when a small additive function does the job cleanly.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sim_sale_unit(
        p_sim_type_id UUID,
        p_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_stock_id UUID;
        v_day_closed_at TIMESTAMPTZ;
        v_current_stock INTEGER;
        v_sale_id UUID;
      BEGIN
        SELECT id, is_active, public_price INTO v_type FROM recharge_sim_types WHERE id = p_sim_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SIM_TYPE_NOT_FOUND:%', p_sim_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'SIM_TYPE_INACTIVE:%', p_sim_type_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        v_daily_stock_id := ensure_recharge_sim_daily_stock(p_sim_type_id, p_date, p_user_id);

        SELECT current_stock INTO v_current_stock
        FROM recharge_sim_daily_stock
        WHERE id = v_daily_stock_id
        FOR UPDATE;

        IF v_current_stock < 1 THEN
          RAISE EXCEPTION 'INSUFFICIENT_SIM_STOCK:%', p_sim_type_id;
        END IF;

        INSERT INTO recharge_sim_sales
          (sim_type_id, daily_stock_id, quantity, unit_price, total_amount, sale_date, created_by)
        VALUES
          (p_sim_type_id, v_daily_stock_id, 1, v_type.public_price, v_type.public_price, p_date, p_user_id)
        RETURNING id INTO v_sale_id;

        UPDATE recharge_sim_daily_stock
        SET current_stock = current_stock - 1,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_stock_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    // register_recharge_sim_sale_registration: called right after
    // register_recharge_sim_sale_unit inside the same transaction — never
    // touches stock itself (the sale it belongs to already did).
    // Re-validates everything server-side, never trusts the frontend's own
    // "required field" checks alone, same discipline as every other
    // register_* function in this module.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sim_sale_registration(
        p_recharge_sim_sale_id UUID,
        p_sim_number VARCHAR,
        p_sku VARCHAR,
        p_client_dpi VARCHAR,
        p_client_id UUID,
        p_sale_price NUMERIC,
        p_dpi_image_id UUID,
        p_sale_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        PERFORM 1 FROM recharge_sim_sales WHERE id = p_recharge_sim_sale_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_SIM_SALE_NOT_FOUND:%', p_recharge_sim_sale_id;
        END IF;

        IF p_sim_number IS NULL OR length(trim(p_sim_number)) = 0 THEN
          RAISE EXCEPTION 'SIM_NUMBER_REQUIRED:%', p_recharge_sim_sale_id;
        END IF;
        IF p_sku IS NULL OR length(trim(p_sku)) = 0 THEN
          RAISE EXCEPTION 'SIM_SALE_SKU_REQUIRED:%', p_recharge_sim_sale_id;
        END IF;
        IF p_client_dpi IS NULL OR length(trim(p_client_dpi)) = 0 THEN
          RAISE EXCEPTION 'CLIENT_DPI_REQUIRED:%', p_recharge_sim_sale_id;
        END IF;
        IF p_sale_price IS NULL OR p_sale_price < 0 THEN
          RAISE EXCEPTION 'INVALID_SIM_SALE_PRICE:%', p_recharge_sim_sale_id;
        END IF;

        -- Never trusts the TypeScript-layer client existence/active check
        -- alone — same pattern as register_bank_deposit_operation's own
        -- p_client_id guard.
        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'SIM_SALE_CLIENT_INVALID:%', p_recharge_sim_sale_id;
          END IF;
        END IF;

        SELECT closed_at INTO v_day_closed_at
        FROM recharge_day_openings
        WHERE date = p_sale_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_recharge_sim_sale_id;
        END IF;

        INSERT INTO recharge_sim_sale_registrations (
          recharge_sim_sale_id, sim_number, sku, client_dpi, client_id,
          sale_price, dpi_image_id, sale_date, created_by
        ) VALUES (
          p_recharge_sim_sale_id, trim(p_sim_number), trim(p_sku), trim(p_client_dpi), p_client_id,
          p_sale_price, p_dpi_image_id, p_sale_date, p_user_id
        )
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    // void_recharge_sim_sale_registration: same "anular con motivo" shape
    // as void_recharge_purchase, gated by the exact same
    // recharge_day_openings.closed_at rule (this module's own real
    // precedent for a void that must not touch a closed day) — but no
    // cuadre-cycle check, since recharge_sim_daily_stock has no
    // sequence/final_balance concept to begin with (see
    // CreateRechargeSims1759300000000's own doc comment). Restores the
    // parent sale's quantity back onto recharge_sim_daily_stock.current_stock
    // — voiding the identity registration is what voids the physical sale
    // it belongs to; recharge_sim_sales itself is never edited, it stays
    // the permanent original record.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_recharge_sim_sale_registration(
        p_id UUID,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_registration RECORD;
        v_sale RECORD;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, recharge_sim_sale_id, is_voided
        INTO v_registration
        FROM recharge_sim_sale_registrations
        WHERE id = p_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'SIM_SALE_REGISTRATION_NOT_FOUND:%', p_id;
        END IF;
        IF v_registration.is_voided THEN
          RAISE EXCEPTION 'SIM_SALE_REGISTRATION_ALREADY_VOIDED:%', p_id;
        END IF;

        SELECT id, daily_stock_id, quantity, sale_date
        INTO v_sale
        FROM recharge_sim_sales
        WHERE id = v_registration.recharge_sim_sale_id
        FOR UPDATE;

        SELECT closed_at INTO v_day_closed_at
        FROM recharge_day_openings
        WHERE date = v_sale.sale_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_id;
        END IF;

        UPDATE recharge_sim_sale_registrations
        SET is_voided = true,
            voided_at = now(),
            voided_by = p_user_id,
            void_reason = trim(p_reason)
        WHERE id = p_id;

        UPDATE recharge_sim_daily_stock
        SET current_stock = current_stock + v_sale.quantity,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_sale.daily_stock_id;

        RETURN p_id;
      END;
      $fn$;
    `);

    // register_recharge_sales_closure gains SIM sale registrations in its
    // v_total_sales computation — same signature (DATE, NUMERIC, UUID,
    // BOOLEAN), so a bare CREATE OR REPLACE is safe (no DROP needed, unlike
    // a parameter-count change — see AddDraftKeyToSales's own doc comment
    // for why that distinction matters). This is what makes the "Total
    // Recaudado" card and the cuadre's "Diferencia" use exactly the same
    // number: both are now sourced from this one function's own
    // recomputation, never a second, independent frontend sum. SIM stock
    // has no cycle/sequence concept, so this sum is scoped by sale_date
    // alone — no cycle resolution needed on that side.
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

        -- Every recharge_sim_sales row for the date counts, whichever flow
        -- created it: the pre-existing by-quantity "Vender SIM" (no
        -- registration row at all — rss.total_amount, the fixed catalog
        -- price, stands as-is) and the new identity-registration flow (its
        -- registration's own sale_price — which the cashier may have
        -- entered as a negotiated amount different from the catalog price
        -- — is what was actually collected, so it wins over total_amount;
        -- 0 when that registration was anulada). A LEFT JOIN, never an
        -- inner one, is what includes the by-quantity rows that have no
        -- registration at all.
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore register_recharge_sales_closure to the version from
    // AddRechargeDayGateToWriteFunctions (SIM sales excluded again) — same
    // signature throughout, so this is also a bare CREATE OR REPLACE.
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

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_recharge_sim_sale_registration(UUID, UUID, VARCHAR)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sim_sale_registration(UUID, VARCHAR, VARCHAR, VARCHAR, UUID, NUMERIC, UUID, DATE, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sim_sale_unit(UUID, DATE, UUID)',
    );
    await queryRunner.query('DROP TABLE IF EXISTS recharge_sim_sale_registrations');
    await queryRunner.query('DROP TABLE IF EXISTS recharge_sim_dpi_images');
  }
}
