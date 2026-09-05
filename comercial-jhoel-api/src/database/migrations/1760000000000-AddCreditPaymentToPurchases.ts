import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Tipo de compra" — Contado / Crédito — the prerequisite for the new
 * payment-due alert. Purely additive: every existing purchase is backfilled
 * to `payment_type = 'CONTADO'`, `payment_status = 'PAID'`,
 * `payment_due_date = NULL` — a historical purchase with no credit
 * information was, in fact, paid in full at the time (there is no real
 * "unspecified" state to invent), so this is the one honest default rather
 * than a fabricated "NO_ESPECIFICADO" status. No row's `total`/items/dates
 * are touched.
 *
 * `payment_status` deliberately only ever stores `'PENDING' | 'PAID'` —
 * "VENCIDA" (overdue) is NEVER a stored value. It's derived at read time
 * (`payment_status = 'PENDING' AND payment_due_date < today`) by the Alerts
 * module — same "derive, don't duplicate" choice this codebase already
 * makes for Recargas' own `totalPurchases`/`sale` getters. Storing a third
 * "OVERDUE" status would need a daily cron/job to flip it at midnight, which
 * this design has no dependency on at all: a purchase's overdue-ness is
 * always computed fresh from today's date, exactly like every other
 * "current month"/"today" computation elsewhere in this codebase.
 */
export class AddCreditPaymentToPurchases1760000000000 implements MigrationInterface {
  name = 'AddCreditPaymentToPurchases1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE purchases
        ADD COLUMN payment_type VARCHAR(20) NOT NULL DEFAULT 'CONTADO',
        ADD COLUMN payment_due_date DATE NULL,
        ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT 'PAID',
        ADD COLUMN paid_at TIMESTAMPTZ NULL,
        ADD COLUMN paid_by UUID NULL,
        ADD CONSTRAINT "FK_purchases_paid_by" FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_purchases_payment_type" CHECK (payment_type IN ('CONTADO', 'CREDITO')),
        ADD CONSTRAINT "CHK_purchases_payment_status" CHECK (payment_status IN ('PENDING', 'PAID')),
        ADD CONSTRAINT "CHK_purchases_credit_has_due_date" CHECK (
          (payment_type = 'CONTADO' AND payment_due_date IS NULL)
          OR
          (payment_type = 'CREDITO' AND payment_due_date IS NOT NULL)
        );
    `);

    // Backfill: every purchase that existed before this migration was
    // registered under the old, credit-unaware flow — it was, in effect, a
    // cash purchase paid at the moment of entry. `paid_at`/`paid_by` are
    // deliberately backfilled from the purchase's OWN `created_at`/`user_id`
    // (not `now()`/some fixed value) — this is the only historically honest
    // "when/who paid it" for a purchase whose payment was never tracked as a
    // separate step, and never invents a payment date the invoice didn't have.
    // Must run BEFORE `CHK_purchases_paid_consistency` is added below — the
    // column defaults above already set every row's `payment_status='PAID'`
    // the instant the column was added, so adding that CHECK in the same
    // statement (before `paid_at`/`paid_by` are backfilled) would reject
    // every existing row as "PAID with no paid_at/paid_by".
    await queryRunner.query(`
      UPDATE purchases SET paid_at = created_at, paid_by = user_id;
    `);

    await queryRunner.query(`
      ALTER TABLE purchases
        ADD CONSTRAINT "CHK_purchases_paid_consistency" CHECK (
          (payment_status = 'PENDING' AND paid_at IS NULL AND paid_by IS NULL)
          OR
          (payment_status = 'PAID' AND paid_at IS NOT NULL AND paid_by IS NOT NULL)
        );
    `);

    await queryRunner.createIndex('purchases', {
      name: 'IDX_purchases_pending_due_date',
      columnNames: ['payment_status', 'payment_due_date'],
    } as never);

    // ==================================================================
    // confirm_purchase — gains two OPTIONAL trailing params (defaulted, so
    // every existing caller that never sends them keeps registering a plain
    // CONTADO purchase, byte-identical to before this migration). Postgres
    // identifies a function by name + argument types, so adding parameters
    // creates a second overload rather than replacing the original — drop
    // the old 4-arg signature explicitly, same gotcha already documented in
    // `AddClientNameToBankDepositOperations`.
    // ==================================================================
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_purchase(UUID, UUID, TIMESTAMPTZ, JSONB)',
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_purchase(
        p_supplier_id UUID,
        p_user_id UUID,
        p_purchase_date TIMESTAMPTZ,
        p_items JSONB,
        p_payment_type VARCHAR DEFAULT 'CONTADO',
        p_payment_due_date DATE DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
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

          SELECT id INTO v_unidad_id FROM product_presentations WHERE product_id = v_product_id AND name = 'Unidad';
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
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_purchase(UUID, UUID, TIMESTAMPTZ, JSONB, VARCHAR, DATE)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_purchase(
        p_supplier_id UUID,
        p_user_id UUID,
        p_purchase_date TIMESTAMPTZ,
        p_items JSONB
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
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
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'PURCHASE_EMPTY';
        END IF;

        SELECT id INTO v_bodega_id FROM inventory_locations WHERE name = 'Bodega';
        IF NOT FOUND THEN
          RAISE EXCEPTION 'LOCATION_NOT_FOUND:Bodega';
        END IF;

        SELECT id, is_active INTO v_supplier FROM suppliers WHERE id = p_supplier_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'SUPPLIER_NOT_FOUND:%', p_supplier_id; END IF;
        IF NOT v_supplier.is_active THEN RAISE EXCEPTION 'SUPPLIER_INACTIVE:%', p_supplier_id; END IF;

        INSERT INTO purchases (supplier_id, user_id, purchase_date, total)
        VALUES (p_supplier_id, p_user_id, p_purchase_date, 0)
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

          SELECT id INTO v_unidad_id FROM product_presentations WHERE product_id = v_product_id AND name = 'Unidad';
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
      $fn$;
    `);
    await queryRunner.dropIndex('purchases', 'IDX_purchases_pending_due_date');
    await queryRunner.query(`
      ALTER TABLE purchases
        DROP CONSTRAINT IF EXISTS "CHK_purchases_paid_consistency",
        DROP CONSTRAINT IF EXISTS "CHK_purchases_credit_has_due_date",
        DROP CONSTRAINT IF EXISTS "CHK_purchases_payment_status",
        DROP CONSTRAINT IF EXISTS "CHK_purchases_payment_type",
        DROP CONSTRAINT IF EXISTS "FK_purchases_paid_by",
        DROP COLUMN IF EXISTS paid_by,
        DROP COLUMN IF EXISTS paid_at,
        DROP COLUMN IF EXISTS payment_status,
        DROP COLUMN IF EXISTS payment_due_date,
        DROP COLUMN IF EXISTS payment_type;
    `);
  }
}
