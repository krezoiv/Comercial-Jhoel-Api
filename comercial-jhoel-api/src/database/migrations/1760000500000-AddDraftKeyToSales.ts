import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Varias ventas a la vez" — Ventas gets the same multiple-simultaneous-draft
 * capability Compras already has (`PurchaseDraftStore`, purely a frontend
 * change since a Compra draft was never server-side). Ventas is different:
 * its draft IS a real, server-persisted `OPEN` sale, gated by
 * `UQ_sales_open_per_user` (see `AddDraftSalesSupport`) to at most one per
 * user — the mechanism behind real-time stock reservation. Supporting
 * several open receipts per user therefore needs a real backend change, not
 * just a frontend one: every "find my open sale" lookup across
 * `adjust_sale_item`/`cancel_open_sale`/`configure_open_sale`/
 * `confirm_open_sale` has to disambiguate WHICH open sale, not just whose.
 *
 * `sales.draft_key` is a client-generated, opaque string (the frontend uses
 * a UUID per open tab) — NULL for every `CONFIRMED` row (meaningless once a
 * sale is real; a draft_key only ever matters while `status = 'OPEN'`).
 * `UQ_sales_open_per_user` is replaced by `UQ_sales_open_per_draft` on
 * `(user_id, draft_key) WHERE status = 'OPEN'` — the same user can now have
 * many open sales, as long as each has a distinct `draft_key`; the exact
 * same "at most one OPEN row per (user, draft)" guarantee the old index gave
 * per (user) alone, just scoped one level finer.
 *
 * All four functions gain `p_draft_key VARCHAR DEFAULT 'default'` as a new
 * trailing parameter. **`CREATE OR REPLACE FUNCTION` does NOT replace a
 * function in place when the parameter count changes** — Postgres
 * identifies a function by `(name, argument types)`, so adding a parameter
 * (even one with a default) creates a brand-new overload alongside the old
 * one, never a true replacement. This was actually already a live bug
 * before this migration: `AddWholesalePricingToSales` added
 * `p_presentation_id`/`p_location_id` to `adjust_sale_item` via a bare
 * `CREATE OR REPLACE`, and the original 3-parameter version from
 * `AddDraftSalesSupport` was still sitting in the database, unreachable by
 * this app's own call sites (which always pass a fixed argument count) but
 * a real hazard for anything that might someday call it with fewer args —
 * confirmed directly via `pg_proc` before writing the fix below, not
 * assumed. Every `DROP FUNCTION IF EXISTS <old-signature>` below cleans up
 * both that pre-existing orphan and the one this migration would otherwise
 * have created for `cancel_open_sale`/`configure_open_sale`/
 * `confirm_open_sale`. General lesson for any future change that adds a
 * parameter to an existing Postgres function in this codebase: always pair
 * it with an explicit `DROP FUNCTION IF EXISTS` of the old signature, never
 * trust a bare `CREATE OR REPLACE` to do it.
 *
 * The `'default'` fallback means any caller that omits the new parameter
 * keeps behaving exactly like today (a single implicit draft named
 * `'default'`) — this migration backfills every currently-open sale to
 * that same value for that reason, not because the value is meaningful on
 * its own.
 */
export class AddDraftKeyToSales1760000500000 implements MigrationInterface {
  name = 'AddDraftKeyToSales1760000500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sales ADD COLUMN draft_key VARCHAR(64) NULL;
    `);

    // Any sale genuinely open right now becomes tab "default" — the same
    // single-draft behavior every existing caller already assumes.
    await queryRunner.query(`
      UPDATE sales SET draft_key = 'default' WHERE status = 'OPEN';
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_sales_open_per_user";
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_sales_open_per_draft" ON sales (user_id, draft_key) WHERE status = 'OPEN';
    `);

    // ------------------------------------------------------------------
    // adjust_sale_item — identical body to `AddWholesalePricingToSales`'s
    // own version, with `p_draft_key` threaded through both "find my open
    // sale" lookups (the initial `FOR UPDATE` select and the unique-
    // violation re-select) and the `INSERT`. Explicit drops first: the
    // 3-arg original (`AddDraftSalesSupport`) was already an orphaned
    // overload before this migration, and the 5-arg version
    // (`AddWholesalePricingToSales`) becomes one now that this migration
    // adds a 6th parameter — see this file's own doc comment above.
    // ------------------------------------------------------------------
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS adjust_sale_item(UUID, UUID, INT);`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS adjust_sale_item(UUID, UUID, INT, UUID, UUID);`,
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION adjust_sale_item(
        p_user_id UUID,
        p_product_id UUID,
        p_quantity_delta INT,
        p_presentation_id UUID DEFAULT NULL,
        p_location_id UUID DEFAULT NULL,
        p_draft_key VARCHAR DEFAULT 'default'
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_price_list VARCHAR(20);
        v_product RECORD;
        v_detail RECORD;
        v_presentation product_presentations;
        v_location_id UUID;
        v_unit_price NUMERIC(12,2);
        v_new_quantity INT;
        v_line_total NUMERIC(12,2);
        v_base_delta INT;
        v_current_location_stock INT;
      BEGIN
        IF p_quantity_delta = 0 THEN
          RAISE EXCEPTION 'INVALID_QUANTITY:%', p_product_id;
        END IF;

        SELECT id, price_list INTO v_sale_id, v_price_list
        FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status, draft_key)
            VALUES (p_user_id, now(), 0, 'OPEN', p_draft_key) RETURNING id, price_list INTO v_sale_id, v_price_list;
          EXCEPTION WHEN unique_violation THEN
            SELECT id, price_list INTO v_sale_id, v_price_list
            FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;
          END;
        END IF;

        SELECT id, is_active, public_price, wholesale_price INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', p_product_id; END IF;

        v_presentation := ensure_product_presentation(p_product_id, p_presentation_id);
        IF p_presentation_id IS NULL THEN
          IF v_price_list = 'WHOLESALE' THEN
            v_unit_price := v_product.wholesale_price;
          ELSE
            v_unit_price := v_product.public_price;
          END IF;
        ELSE
          v_unit_price := v_presentation.public_price;
        END IF;

        IF p_location_id IS NOT NULL THEN
          v_location_id := p_location_id;
        ELSE
          SELECT id INTO v_location_id FROM inventory_locations WHERE name = 'Vitrina';
          IF NOT FOUND THEN RAISE EXCEPTION 'LOCATION_NOT_FOUND:Vitrina'; END IF;
        END IF;

        SELECT id, quantity INTO v_detail
        FROM sale_details
        WHERE sale_id = v_sale_id AND product_id = p_product_id AND presentation_id = v_presentation.id
        FOR UPDATE;

        v_new_quantity := COALESCE(v_detail.quantity, 0) + p_quantity_delta;
        IF v_new_quantity < 0 THEN
          RAISE EXCEPTION 'INVALID_QUANTITY:%', p_product_id;
        END IF;

        v_base_delta := p_quantity_delta * v_presentation.conversion_factor;

        PERFORM ensure_inventory_stock_row(p_product_id, v_location_id);

        IF p_quantity_delta > 0 THEN
          IF NOT v_product.is_active THEN RAISE EXCEPTION 'PRODUCT_INACTIVE:%', p_product_id; END IF;

          SELECT quantity INTO v_current_location_stock
          FROM inventory_stock WHERE product_id = p_product_id AND location_id = v_location_id FOR UPDATE;

          IF v_current_location_stock < v_base_delta THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', p_product_id;
          END IF;
        ELSE
          PERFORM 1 FROM inventory_stock WHERE product_id = p_product_id AND location_id = v_location_id FOR UPDATE;
        END IF;

        UPDATE products SET stock = stock - v_base_delta WHERE id = p_product_id;
        UPDATE inventory_stock SET quantity = quantity - v_base_delta, updated_at = now()
          WHERE product_id = p_product_id AND location_id = v_location_id;

        IF v_new_quantity = 0 THEN
          IF v_detail.id IS NOT NULL THEN DELETE FROM sale_details WHERE id = v_detail.id; END IF;
        ELSE
          v_line_total := v_unit_price * v_new_quantity;
          IF v_detail.id IS NOT NULL THEN
            UPDATE sale_details
            SET quantity = v_new_quantity, unit_price = v_unit_price, total = v_line_total,
                conversion_factor = v_presentation.conversion_factor,
                quantity_base_units = v_new_quantity * v_presentation.conversion_factor,
                location_id = v_location_id
            WHERE id = v_detail.id;
          ELSE
            INSERT INTO sale_details
              (sale_id, product_id, quantity, unit_price, total,
               presentation_id, conversion_factor, quantity_base_units, location_id)
            VALUES
              (v_sale_id, p_product_id, v_new_quantity, v_unit_price, v_line_total,
               v_presentation.id, v_presentation.conversion_factor,
               v_new_quantity * v_presentation.conversion_factor, v_location_id);
          END IF;
        END IF;

        UPDATE sales SET total = COALESCE((SELECT SUM(total) FROM sale_details WHERE sale_id = v_sale_id), 0)
          WHERE id = v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // cancel_open_sale — genuinely fixed here, not just re-scoped: the
    // version this replaces (`AddDraftSalesSupport`) only ever restored
    // `products.stock`, and was never updated when
    // `CreateInventoryLocationsAndPresentations` introduced the
    // per-location `inventory_stock` table — unlike `adjust_sale_item`/
    // `confirm_open_sale`, which both already handle it correctly. That gap
    // predates this migration (confirmed directly: cancelling a real draft
    // during this feature's own manual testing left `products.stock` correct
    // but `inventory_stock`'s Vitrina row permanently 1 unit short — a real,
    // silent stock-count drift, not a hypothetical). Fixed by restoring
    // `inventory_stock` too, using each line's own `location_id` (falling
    // back to Vitrina for a historical row that predates that column, same
    // fallback `confirm_open_sale` already uses) and `quantity_base_units`
    // (falling back to `quantity` for the same reason — a presentation with
    // `conversion_factor != 1`, e.g. a "Caja", must restore the full base-unit
    // amount that was actually reserved, not the presentation-level count).
    // ------------------------------------------------------------------
    await queryRunner.query(`DROP FUNCTION IF EXISTS cancel_open_sale(UUID);`);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cancel_open_sale(p_user_id UUID, p_draft_key VARCHAR DEFAULT 'default')
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_detail RECORD;
        v_vitrina_id UUID;
        v_restore_amount INT;
      BEGIN
        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          RETURN FALSE;
        END IF;

        SELECT id INTO v_vitrina_id FROM inventory_locations WHERE name = 'Vitrina';

        FOR v_detail IN
          SELECT product_id, quantity, location_id, quantity_base_units
          FROM sale_details WHERE sale_id = v_sale_id ORDER BY product_id FOR UPDATE
        LOOP
          v_restore_amount := COALESCE(v_detail.quantity_base_units, v_detail.quantity);
          UPDATE products SET stock = stock + v_restore_amount WHERE id = v_detail.product_id;
          UPDATE inventory_stock
            SET quantity = quantity + v_restore_amount, updated_at = now()
            WHERE product_id = v_detail.product_id
              AND location_id = COALESCE(v_detail.location_id, v_vitrina_id);
        END LOOP;

        DELETE FROM sale_details WHERE sale_id = v_sale_id;
        DELETE FROM sales WHERE id = v_sale_id;

        RETURN TRUE;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // configure_open_sale — identical body to `AddWholesalePricingToSales`'s
    // own version, scoped to `(user_id, draft_key)`.
    // ------------------------------------------------------------------
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS configure_open_sale(UUID, UUID, VARCHAR);`,
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION configure_open_sale(
        p_user_id UUID,
        p_client_id UUID DEFAULT NULL,
        p_price_list VARCHAR DEFAULT 'PUBLIC',
        p_draft_key VARCHAR DEFAULT 'default'
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_current_price_list VARCHAR(20);
        v_has_items BOOLEAN;
      BEGIN
        SELECT id, price_list INTO v_sale_id, v_current_price_list
        FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;

        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status, client_id, price_list, draft_key)
            VALUES (p_user_id, now(), 0, 'OPEN', p_client_id, p_price_list, p_draft_key)
            RETURNING id INTO v_sale_id;
            RETURN v_sale_id;
          EXCEPTION WHEN unique_violation THEN
            SELECT id, price_list INTO v_sale_id, v_current_price_list
            FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;
          END;
        END IF;

        SELECT EXISTS(SELECT 1 FROM sale_details WHERE sale_id = v_sale_id) INTO v_has_items;
        IF v_has_items AND v_current_price_list IS DISTINCT FROM p_price_list THEN
          RAISE EXCEPTION 'PRICE_LIST_LOCKED:%', v_sale_id;
        END IF;

        UPDATE sales SET client_id = p_client_id, price_list = p_price_list WHERE id = v_sale_id;
        RETURN v_sale_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // confirm_open_sale — identical body to `CreateInventoryLocationsAndPresentations`'s
    // own version, scoped to `(user_id, draft_key)`.
    // ------------------------------------------------------------------
    await queryRunner.query(`DROP FUNCTION IF EXISTS confirm_open_sale(UUID);`);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_open_sale(p_user_id UUID, p_draft_key VARCHAR DEFAULT 'default')
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_detail RECORD;
        v_vitrina_id UUID;
        v_unidad_id UUID;
      BEGIN
        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND draft_key = p_draft_key AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          RETURN NULL;
        END IF;

        SELECT id INTO v_vitrina_id FROM inventory_locations WHERE name = 'Vitrina';

        FOR v_detail IN
          SELECT product_id, presentation_id, quantity, quantity_base_units, conversion_factor, location_id
          FROM sale_details WHERE sale_id = v_sale_id
        LOOP
          IF v_detail.presentation_id IS NULL THEN
            SELECT id INTO v_unidad_id FROM product_presentations WHERE product_id = v_detail.product_id AND name = 'Unidad';
          END IF;

          INSERT INTO inventory_movements
            (product_id, presentation_id, location_from_id, location_to_id, movement_type,
             quantity_presentation, conversion_factor, quantity_base_units,
             reference_type, reference_id, user_id)
          VALUES
            (v_detail.product_id, COALESCE(v_detail.presentation_id, v_unidad_id),
             COALESCE(v_detail.location_id, v_vitrina_id), NULL, 'SALIDA_VENTA',
             v_detail.quantity, COALESCE(v_detail.conversion_factor, 1),
             COALESCE(v_detail.quantity_base_units, v_detail.quantity),
             'SALE', v_sale_id, p_user_id);
        END LOOP;

        UPDATE sales SET status = 'CONFIRMED', sale_date = now() WHERE id = v_sale_id;
        RETURN v_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // No functional downgrade provided — same "no downgrade for a
    // correctness/structural addition" precedent already established in
    // this project (see `AddWholesalePricingToSales`'s own `down()`).
    // Reverting would strand any sale draft already tagged with a
    // non-default `draft_key`, and there is no safe way to collapse
    // multiple simultaneously-open drafts for one user back down to the
    // single-open-sale invariant the old index enforced.
  }
}
