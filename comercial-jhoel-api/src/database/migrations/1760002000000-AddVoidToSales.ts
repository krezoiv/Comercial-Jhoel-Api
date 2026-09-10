import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Anular venta" — the correction path for a mistaken CONFIRMED sale, for
 * the new "Administrar Facturas de Ventas" module (Sistema). Mirrors
 * `AddVoidToPurchases` exactly: never a physical DELETE, never an in-place
 * edit — the original row stays exactly as it was, marked `ANULADA`
 * forever, with full audit trail. No "editar venta" exists — the
 * correction path is always anular + registrar una venta nueva y correcta.
 *
 * Also adds `invoice_number` — same free-text, optional, non-unique search
 * aid as `purchases.invoice_number`.
 *
 * `void_sale()` only ever targets a `CONFIRMED` sale — an `OPEN` draft
 * already has its own correction mechanism (`cancel_open_sale`, which
 * discards it entirely since it was never a real transaction). It restores
 * the exact inventory effect `confirm_sale`/`confirm_open_sale` applied
 * (stock/inventory_stock incremented back by each line's own
 * `quantity_base_units`, at whichever location it was actually sold from)
 * and writes an `ENTRADA_ANULACION_VENTA` movement per line — the mirror
 * image of `void_purchase`'s own `SALIDA_ANULACION_COMPRA`. Unlike
 * `void_purchase`, there is no "would go negative" guard needed here:
 * restoring stock can never make it negative.
 *
 * No product-price reversal — a sale never modifies `products`/
 * `product_presentations` pricing in the first place (only a purchase
 * does), so there's nothing of that kind to consider here.
 *
 * No payment-status guard either — unlike Purchases, Sales has no Contado/
 * Crédito concept and no linkage to Cuentas por Cobrar (confirmed before
 * writing this migration, not assumed) — a sale's `priceList`/`clientId`
 * are just attribution, not a financial obligation this function needs to
 * protect.
 */
export class AddVoidToSales1760002000000 implements MigrationInterface {
  name = 'AddVoidToSales1760002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sales
        ADD COLUMN invoice_number VARCHAR(50) NULL,
        ADD COLUMN is_voided BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN voided_at TIMESTAMPTZ NULL,
        ADD COLUMN voided_by UUID NULL,
        ADD COLUMN void_reason VARCHAR(255) NULL,
        ADD CONSTRAINT "FK_sales_voided_by" FOREIGN KEY (voided_by) REFERENCES users(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_sales_void_consistency" CHECK (
          (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR
          (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_sales_invoice_number" ON sales (invoice_number);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_sale(
        p_sale_id UUID,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale RECORD;
        v_detail RECORD;
        v_restore_qty INT;
        v_presentation_id UUID;
        v_vitrina_id UUID;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, status, is_voided
        INTO v_sale
        FROM sales WHERE id = p_sale_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'SALE_NOT_FOUND:%', p_sale_id; END IF;
        IF v_sale.status != 'CONFIRMED' THEN RAISE EXCEPTION 'SALE_NOT_CONFIRMED:%', p_sale_id; END IF;
        IF v_sale.is_voided THEN RAISE EXCEPTION 'SALE_ALREADY_VOIDED:%', p_sale_id; END IF;

        SELECT id INTO v_vitrina_id FROM inventory_locations WHERE name = 'Vitrina';

        FOR v_detail IN
          SELECT product_id, presentation_id, location_id, quantity,
                 COALESCE(quantity_base_units, quantity) AS quantity_base_units,
                 COALESCE(conversion_factor, 1) AS conversion_factor
          FROM sale_details
          WHERE sale_id = p_sale_id
          ORDER BY product_id
        LOOP
          v_restore_qty := v_detail.quantity_base_units;

          PERFORM 1 FROM products WHERE id = v_detail.product_id FOR UPDATE;
          UPDATE products SET stock = stock + v_restore_qty WHERE id = v_detail.product_id;

          PERFORM ensure_inventory_stock_row(v_detail.product_id, COALESCE(v_detail.location_id, v_vitrina_id));
          UPDATE inventory_stock SET quantity = quantity + v_restore_qty, updated_at = now()
            WHERE product_id = v_detail.product_id AND location_id = COALESCE(v_detail.location_id, v_vitrina_id);

          IF v_detail.presentation_id IS NOT NULL THEN
            v_presentation_id := v_detail.presentation_id;
          ELSE
            SELECT pp.id INTO v_presentation_id
              FROM product_presentations pp
              JOIN presentation_types pt ON pt.id = pp.presentation_type_id
              WHERE pp.product_id = v_detail.product_id AND pt.name = 'Unidad';
          END IF;

          INSERT INTO inventory_movements
            (product_id, presentation_id, location_from_id, location_to_id, movement_type,
             quantity_presentation, conversion_factor, quantity_base_units,
             reference_type, reference_id, user_id, reason)
          VALUES
            (v_detail.product_id, v_presentation_id, NULL, COALESCE(v_detail.location_id, v_vitrina_id),
             'ENTRADA_ANULACION_VENTA', v_detail.quantity, v_detail.conversion_factor, v_restore_qty,
             'SALE_VOID', p_sale_id, p_user_id, p_reason);
        END LOOP;

        UPDATE sales
          SET is_voided = true, voided_at = now(), voided_by = p_user_id, void_reason = trim(p_reason)
          WHERE id = p_sale_id;

        RETURN p_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS void_sale(UUID, UUID, VARCHAR)');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_sales_invoice_number"');
    await queryRunner.query(`
      ALTER TABLE sales
        DROP CONSTRAINT IF EXISTS "CHK_sales_void_consistency",
        DROP CONSTRAINT IF EXISTS "FK_sales_voided_by",
        DROP COLUMN IF EXISTS void_reason,
        DROP COLUMN IF EXISTS voided_by,
        DROP COLUMN IF EXISTS voided_at,
        DROP COLUMN IF EXISTS is_voided,
        DROP COLUMN IF EXISTS invoice_number;
    `);
  }
}
