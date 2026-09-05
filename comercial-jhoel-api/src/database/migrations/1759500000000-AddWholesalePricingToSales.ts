import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Venta por mayor" — lets a sale be tagged with an optional client and a
 * price list (`PUBLIC`/`WHOLESALE`), chosen once at the start of the sale
 * and locked once the receipt has any line item. Purely additive: no
 * existing table is dropped, no existing row is touched — historical and
 * in-progress sales default to `price_list = 'PUBLIC'`, `client_id = NULL`,
 * byte-identical to today's actual (implicit) behavior.
 *
 * `products.wholesale_price` already existed (required at product
 * creation) but was never read by any sale function — `adjust_sale_item`
 * and `confirm_sale` only ever charged `public_price`. This migration is
 * what makes `wholesale_price` actually mean something, and only for the
 * base "Unidad" presentation — a line sold by a presentation (Caja,
 * Paquete...) keeps using that presentation's own `public_price`
 * regardless of the sale's price list, by deliberate scope decision
 * (presentations are already the bulk-discount mechanism; this feature is
 * about which *client tier* buys, not a second discount on top).
 */
export class AddWholesalePricingToSales1759500000000 implements MigrationInterface {
  name = 'AddWholesalePricingToSales1759500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // sales.client_id / sales.price_list — additive, nullable/defaulted
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE sales
        ADD COLUMN client_id UUID NULL,
        ADD COLUMN price_list VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
        ADD CONSTRAINT "FK_sales_client" FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_sales_price_list" CHECK (price_list IN ('PUBLIC', 'WHOLESALE'));
    `);

    // ==================================================================
    // Stored functions
    // ==================================================================

    // configure_open_sale: sets/updates the caller's open receipt's client
    // and price list — creates the receipt if it doesn't exist yet (same
    // race-safe "insert, catch unique_violation, re-select" pattern
    // adjust_sale_item already uses against the same UQ_sales_open_per_user
    // partial index). The client can be changed freely at any time (pure
    // attribution, no pricing/stock impact); the price list can only be
    // changed while the receipt has zero line items — once a line exists,
    // its unit_price was already fixed under the *current* price list, and
    // silently changing the list without recomputing every existing line
    // would leave the receipt internally inconsistent.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION configure_open_sale(
        p_user_id UUID,
        p_client_id UUID DEFAULT NULL,
        p_price_list VARCHAR DEFAULT 'PUBLIC'
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
        FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;

        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status, client_id, price_list)
            VALUES (p_user_id, now(), 0, 'OPEN', p_client_id, p_price_list)
            RETURNING id INTO v_sale_id;
            RETURN v_sale_id;
          EXCEPTION WHEN unique_violation THEN
            SELECT id, price_list INTO v_sale_id, v_current_price_list
            FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
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

    // adjust_sale_item: the existing "find or create OPEN sale" step now
    // also captures the sale's price_list; when a line has no explicit
    // presentation (the "Unidad" case), the unit price resolves to
    // wholesale_price under a WHOLESALE sale, public_price otherwise —
    // byte-identical to today's behavior for every PUBLIC (default) sale.
    // A presentation-priced line is untouched by this change (still always
    // v_presentation.public_price), per the scope decision above.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION adjust_sale_item(
        p_user_id UUID,
        p_product_id UUID,
        p_quantity_delta INT,
        p_presentation_id UUID DEFAULT NULL,
        p_location_id UUID DEFAULT NULL
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
        FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status)
            VALUES (p_user_id, now(), 0, 'OPEN') RETURNING id, price_list INTO v_sale_id, v_price_list;
          EXCEPTION WHEN unique_violation THEN
            SELECT id, price_list INTO v_sale_id, v_price_list
            FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
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

    // confirm_sale: bulk, one-shot path — not used by the live Ventas
    // screen (which uses adjust_sale_item's real-time draft flow instead),
    // but kept in sync with it, same precedent already established for
    // presentation/location handling. Gains optional p_client_id/
    // p_price_list, applies the identical Unidad-only wholesale rule above.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_sale(
        p_user_id UUID,
        p_items JSONB,
        p_client_id UUID DEFAULT NULL,
        p_price_list VARCHAR DEFAULT 'PUBLIC'
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_product RECORD;
        v_presentation product_presentations;
        v_location_id UUID;
        v_unit_price NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_sale_total NUMERIC(12,2) := 0;
        v_base_units INT;
        v_current_location_stock INT;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'SALE_EMPTY';
        END IF;

        INSERT INTO sales (user_id, sale_date, total, client_id, price_list)
        VALUES (p_user_id, now(), 0, p_client_id, p_price_list)
        RETURNING id INTO v_sale_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;

          SELECT id, is_active, public_price, wholesale_price INTO v_product FROM products WHERE id = v_product_id FOR UPDATE;
          IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id; END IF;
          IF NOT v_product.is_active THEN RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id; END IF;

          IF v_item ? 'presentationId' AND (v_item->>'presentationId') IS NOT NULL THEN
            v_presentation := ensure_product_presentation(v_product_id, (v_item->>'presentationId')::UUID);
            v_unit_price := v_presentation.public_price;
          ELSE
            v_presentation := ensure_product_presentation(v_product_id, NULL);
            IF p_price_list = 'WHOLESALE' THEN
              v_unit_price := v_product.wholesale_price;
            ELSE
              v_unit_price := v_product.public_price;
            END IF;
          END IF;

          SELECT id INTO v_location_id FROM inventory_locations WHERE name = 'Vitrina';
          IF NOT FOUND THEN RAISE EXCEPTION 'LOCATION_NOT_FOUND:Vitrina'; END IF;

          v_base_units := v_quantity * v_presentation.conversion_factor;

          PERFORM ensure_inventory_stock_row(v_product_id, v_location_id);
          SELECT quantity INTO v_current_location_stock
            FROM inventory_stock WHERE product_id = v_product_id AND location_id = v_location_id FOR UPDATE;
          IF v_current_location_stock < v_base_units THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', v_product_id;
          END IF;

          v_line_total := v_unit_price * v_quantity;
          v_sale_total := v_sale_total + v_line_total;

          INSERT INTO sale_details
            (sale_id, product_id, quantity, unit_price, total,
             presentation_id, conversion_factor, quantity_base_units, location_id)
          VALUES
            (v_sale_id, v_product_id, v_quantity, v_unit_price, v_line_total,
             v_presentation.id, v_presentation.conversion_factor, v_base_units, v_location_id);

          UPDATE products SET stock = stock - v_base_units WHERE id = v_product_id;
          UPDATE inventory_stock SET quantity = quantity - v_base_units, updated_at = now()
            WHERE product_id = v_product_id AND location_id = v_location_id;

          INSERT INTO inventory_movements
            (product_id, presentation_id, location_from_id, location_to_id, movement_type,
             quantity_presentation, conversion_factor, quantity_base_units,
             reference_type, reference_id, user_id)
          VALUES
            (v_product_id, v_presentation.id, v_location_id, NULL, 'SALIDA_VENTA',
             v_quantity, v_presentation.conversion_factor, v_base_units, 'SALE', v_sale_id, p_user_id);
        END LOOP;

        UPDATE sales SET total = v_sale_total WHERE id = v_sale_id;
        RETURN v_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // No functional downgrade provided — same "no downgrade for a
    // correctness/structural addition" precedent already established in
    // this project (see e.g. CreateInventoryLocationsAndPresentations' own
    // down()). Reverting would strand any sale already tagged with a
    // client or a non-default price list.
  }
}
