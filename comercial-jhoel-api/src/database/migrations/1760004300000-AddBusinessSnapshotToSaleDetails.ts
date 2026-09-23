import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Caja de Ventas por negocio" — before this migration, the only way to
 * know which `business` a sold line belonged to was joining out to the
 * *current* `products.business_id`, which silently rewrites history if a
 * product's business classification ever changes later (exactly the
 * historical-accuracy gap the ticket that built this flagged explicitly).
 * `sale_details.business_id` is a permanent snapshot, taken once at the
 * moment of sale — reusing `products.business_id` (the existing, real
 * "línea de negocio" classification this app already has, see
 * `CreateBusinessesTable`) as the single source of truth, never inventing a
 * second one.
 *
 * Backfill uses each row's product's *current* business — the best (and
 * only) information actually available for historical rows, per the
 * ticket's own "no inventar datos" instruction. Going forward, `confirm_sale`/
 * `adjust_sale_item` both snapshot it at insert time (see below) — the
 * only two places a `sale_details` row is ever created — so a later
 * business reassignment on the product never touches an already-recorded
 * sale again.
 */
export class AddBusinessSnapshotToSaleDetails1760004300000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sale_details ADD COLUMN business_id UUID NULL;
    `);

    await queryRunner.query(`
      UPDATE sale_details sd
      SET business_id = p.business_id
      FROM products p
      WHERE p.id = sd.product_id;
    `);

    // Every product has a NOT NULL business_id (see CreateBusinessesTable),
    // so every sale_details row was resolvable above — safe to tighten.
    await queryRunner.query(`
      ALTER TABLE sale_details ALTER COLUMN business_id SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE sale_details
        ADD CONSTRAINT "FK_sale_details_business" FOREIGN KEY (business_id)
        REFERENCES businesses(id) ON DELETE RESTRICT;
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sale_details_business_id" ON sale_details (business_id);
    `);

    // ------------------------------------------------------------------
    // confirm_sale — body-only change (same signature as
    // AddWholesalePricingToSales, so a plain CREATE OR REPLACE is safe,
    // no DROP FUNCTION needed): v_product now also resolves business_id,
    // and the sale_details INSERT snapshots it.
    // ------------------------------------------------------------------
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

          SELECT id, is_active, public_price, wholesale_price, business_id INTO v_product FROM products WHERE id = v_product_id FOR UPDATE;
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
             presentation_id, conversion_factor, quantity_base_units, location_id, business_id)
          VALUES
            (v_sale_id, v_product_id, v_quantity, v_unit_price, v_line_total,
             v_presentation.id, v_presentation.conversion_factor, v_base_units, v_location_id, v_product.business_id);

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

    // ------------------------------------------------------------------
    // adjust_sale_item — body-only change (same signature as
    // AddDraftKeyToSales): v_product now also resolves business_id, and
    // the sale_details INSERT (new-line branch only — the UPDATE branch
    // for an already-existing line never needs to touch business_id,
    // it was already set when that line was first created) snapshots it.
    // ------------------------------------------------------------------
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

        SELECT id, is_active, public_price, wholesale_price, business_id INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
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
               presentation_id, conversion_factor, quantity_base_units, location_id, business_id)
            VALUES
              (v_sale_id, p_product_id, v_new_quantity, v_unit_price, v_line_total,
               v_presentation.id, v_presentation.conversion_factor,
               v_new_quantity * v_presentation.conversion_factor, v_location_id, v_product.business_id);
          END IF;
        END IF;

        UPDATE sales SET total = COALESCE((SELECT SUM(total) FROM sale_details WHERE sale_id = v_sale_id), 0)
          WHERE id = v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // No functional downgrade provided — same "no downgrade for a
    // structural/correctness addition" precedent already established in
    // this project (see e.g. CreateInventoryLocationsAndPresentations' own
    // down()). Reverting the column would permanently discard the
    // per-business historical snapshot this migration exists to add, and
    // the two functions above would need to revert to their exact prior
    // bodies to stay consistent with a business_id-less table.
  }
}
