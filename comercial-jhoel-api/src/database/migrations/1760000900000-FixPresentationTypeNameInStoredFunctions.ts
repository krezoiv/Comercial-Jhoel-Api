import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Hotfix: `CreatePresentationTypesTable` dropped `product_presentations.name`
 * (replaced by `presentation_type_id`, resolved via join — see that
 * migration's own doc comment), but three live Postgres functions still
 * queried `product_presentations WHERE ... AND name = 'Unidad'` directly,
 * a plain column reference this migration missed entirely. Confirmed live:
 * `POST /purchases` (`confirm_purchase`) failed with
 * `QueryFailedError: column "name" does not exist` on every attempt —
 * caught from the real `GlobalExceptionFilter` log, not assumed.
 *
 * Fix: each of the three now resolves "the product's Unidad presentation"
 * via a join to `presentation_types` instead of a bare column. Verified
 * beforehand which functions were actually affected — `SELECT prosrc FROM
 * pg_proc WHERE prosrc ILIKE '%product_presentations%'` — rather than
 * guessing: `ensure_product_presentation` (the shared resolver `adjust_sale_item`/
 * `confirm_sale`/`register_inventory_transfer` all call, so fixing it here
 * fixes all three transitively), `confirm_open_sale`, and `confirm_purchase`
 * each had exactly one broken reference; nothing else did.
 *
 * Plain `CREATE OR REPLACE FUNCTION` is safe here — none of these three
 * change parameter count or types (only fixing SQL bodies), so this does
 * **not** hit the "CREATE OR REPLACE doesn't replace on parameter-count
 * change" gotcha documented elsewhere in this codebase; no `DROP FUNCTION`
 * needed first.
 */
export class FixPresentationTypeNameInStoredFunctions1760000900000
  implements MigrationInterface
{
  name = 'FixPresentationTypeNameInStoredFunctions1760000900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.ensure_product_presentation(p_product_id uuid, p_presentation_id uuid)
       RETURNS product_presentations
       LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_presentation product_presentations;
      BEGIN
        IF p_presentation_id IS NOT NULL THEN
          SELECT * INTO v_presentation
          FROM product_presentations
          WHERE id = p_presentation_id AND product_id = p_product_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRESENTATION_NOT_FOUND:%', p_product_id;
          END IF;
          IF NOT v_presentation.is_active THEN
            RAISE EXCEPTION 'PRESENTATION_INACTIVE:%', p_product_id;
          END IF;
        ELSE
          SELECT pp.* INTO v_presentation
          FROM product_presentations pp
          JOIN presentation_types pt ON pt.id = pp.presentation_type_id
          WHERE pp.product_id = p_product_id AND pt.name = 'Unidad';
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRESENTATION_NOT_FOUND:%', p_product_id;
          END IF;
        END IF;
        RETURN v_presentation;
      END;
      $function$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.confirm_open_sale(p_user_id uuid, p_draft_key character varying DEFAULT 'default'::character varying)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
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
            SELECT pp.id INTO v_unidad_id
            FROM product_presentations pp
            JOIN presentation_types pt ON pt.id = pp.presentation_type_id
            WHERE pp.product_id = v_detail.product_id AND pt.name = 'Unidad';
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
      $function$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.confirm_purchase(p_supplier_id uuid, p_user_id uuid, p_purchase_date timestamp with time zone, p_items jsonb, p_payment_type character varying DEFAULT 'CONTADO'::character varying, p_payment_due_date date DEFAULT NULL::date)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_purchase_id UUID;
        v_supplier RECORD;
        v_item JSONB;
        v_product_id UUID;
        v_presentation_id UUID;
        v_quantity_presentation INT;
        v_cost_price NUMERIC(12,2);
        v_public_price NUMERIC(12,2);
        v_conversion_factor INT;
        v_quantity_base INT;
        v_line_total NUMERIC(12,2);
        v_purchase_total NUMERIC(12,2) := 0;
        v_product RECORD;
        v_presentation product_presentations;
        v_unidad_id UUID;
        v_bodega_id UUID;
        v_payment_status VARCHAR(20);
        v_paid_at TIMESTAMPTZ;
        v_paid_by UUID;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'PURCHASE_EMPTY';
        END IF;

        IF p_payment_type NOT IN ('CONTADO', 'CREDITO') THEN
          RAISE EXCEPTION 'INVALID_PAYMENT_TYPE';
        END IF;
        IF p_payment_type = 'CREDITO' AND p_payment_due_date IS NULL THEN
          RAISE EXCEPTION 'PAYMENT_DUE_DATE_REQUIRED';
        END IF;
        IF p_payment_type = 'CONTADO' THEN
          p_payment_due_date := NULL;
          v_payment_status := 'PAID';
          v_paid_at := now();
          v_paid_by := p_user_id;
        ELSE
          v_payment_status := 'PENDING';
          v_paid_at := NULL;
          v_paid_by := NULL;
        END IF;

        SELECT id INTO v_bodega_id FROM inventory_locations WHERE name = 'Bodega';
        IF NOT FOUND THEN
          RAISE EXCEPTION 'LOCATION_NOT_FOUND:Bodega';
        END IF;

        SELECT id, is_active INTO v_supplier FROM suppliers WHERE id = p_supplier_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'SUPPLIER_NOT_FOUND:%', p_supplier_id; END IF;
        IF NOT v_supplier.is_active THEN RAISE EXCEPTION 'SUPPLIER_INACTIVE:%', p_supplier_id; END IF;

        INSERT INTO purchases
          (supplier_id, user_id, purchase_date, total,
           payment_type, payment_due_date, payment_status, paid_at, paid_by)
        VALUES
          (p_supplier_id, p_user_id, p_purchase_date, 0,
           p_payment_type, p_payment_due_date, v_payment_status, v_paid_at, v_paid_by)
        RETURNING id INTO v_purchase_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity_presentation := (v_item->>'quantity')::INT;
          v_cost_price := (v_item->>'costPrice')::NUMERIC(12,2);
          v_public_price := (v_item->>'publicPrice')::NUMERIC(12,2);

          IF v_quantity_presentation IS NULL OR v_quantity_presentation <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;
          IF v_cost_price IS NULL OR v_cost_price < 0 OR v_public_price IS NULL OR v_public_price < 0 THEN
            RAISE EXCEPTION 'INVALID_PRICE:%', v_product_id;
          END IF;

          SELECT id, is_active INTO v_product FROM products WHERE id = v_product_id FOR UPDATE;
          IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id; END IF;
          IF NOT v_product.is_active THEN RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id; END IF;

          IF v_item ? 'presentationId' AND (v_item->>'presentationId') IS NOT NULL THEN
            v_presentation := ensure_product_presentation(v_product_id, (v_item->>'presentationId')::UUID);
          ELSE
            v_presentation := ensure_product_presentation(v_product_id, NULL);
          END IF;
          v_presentation_id := v_presentation.id;
          v_conversion_factor := v_presentation.conversion_factor;
          v_quantity_base := v_quantity_presentation * v_conversion_factor;
          v_line_total := v_cost_price * v_quantity_presentation;
          v_purchase_total := v_purchase_total + v_line_total;

          INSERT INTO purchase_details
            (purchase_id, product_id, quantity, cost_price, public_price, total,
             presentation_id, location_id, conversion_factor, quantity_base_units)
          VALUES
            (v_purchase_id, v_product_id, v_quantity_presentation, v_cost_price, v_public_price, v_line_total,
             v_presentation_id, v_bodega_id, v_conversion_factor, v_quantity_base);

          UPDATE products SET stock = stock + v_quantity_base WHERE id = v_product_id;

          SELECT pp.id INTO v_unidad_id
          FROM product_presentations pp
          JOIN presentation_types pt ON pt.id = pp.presentation_type_id
          WHERE pp.product_id = v_product_id AND pt.name = 'Unidad';
          IF v_presentation_id = v_unidad_id THEN
            UPDATE products SET cost_price = v_cost_price, public_price = v_public_price WHERE id = v_product_id;
          END IF;
          UPDATE product_presentations SET cost_price = v_cost_price, public_price = v_public_price, updated_at = now()
            WHERE id = v_presentation_id;

          PERFORM ensure_inventory_stock_row(v_product_id, v_bodega_id);
          UPDATE inventory_stock SET quantity = quantity + v_quantity_base, updated_at = now()
            WHERE product_id = v_product_id AND location_id = v_bodega_id;

          INSERT INTO inventory_movements
            (product_id, presentation_id, location_from_id, location_to_id, movement_type,
             quantity_presentation, conversion_factor, quantity_base_units,
             reference_type, reference_id, user_id)
          VALUES
            (v_product_id, v_presentation_id, NULL, v_bodega_id, 'ENTRADA_COMPRA',
             v_quantity_presentation, v_conversion_factor, v_quantity_base,
             'PURCHASE', v_purchase_id, p_user_id);
        END LOOP;

        UPDATE purchases SET total = v_purchase_total WHERE id = v_purchase_id;
        RETURN v_purchase_id;
      END;
      $function$
    `);
  }

  /**
   * No down-migration — reverting would mean putting back a function body
   * that reads a column (`product_presentations.name`) this project's own
   * schema no longer has, which would just reintroduce the exact bug this
   * migration exists to fix. Same "no downgrade for a correctness fix"
   * precedent already used elsewhere in this codebase.
   */
  public async down(): Promise<void> {}
}
