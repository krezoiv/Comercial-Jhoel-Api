import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Anular factura de compra" — the correction path for a mistaken purchase
 * invoice, built for the new "Administrar Facturas de Compras" module
 * (Sistema). Same philosophy as every other financial correction in this
 * codebase (`void_recharge_purchase`, `AddVoidToBankDepositOperations`,
 * tickets, cotizaciones): never a physical DELETE, never an in-place edit —
 * the original row stays exactly as registered, marked `ANULADA` forever,
 * with full audit trail. There is deliberately NO "editar factura" that
 * touches products/cantidades/costos (see this ticket's own decision): the
 * correction path is always anular + registrar una compra nueva y correcta.
 *
 * Also adds `invoice_number` — purchases never stored a real invoice/folio
 * number before this (the `C-XXXXXXXX` shown in Reportería is only derived
 * from the id at read time, never persisted). Nullable, no uniqueness
 * constraint — a supplier's own folio can legitimately repeat across
 * different suppliers, or even the same one over time, so this is a search
 * aid, not an identifier the system relies on.
 *
 * `void_purchase()` reverses the exact inventory effect `confirm_purchase`
 * applied (stock/inventory_stock decremented by each line's own
 * `quantity_base_units`, guarded against ever going negative — e.g. if the
 * stock received was already partially sold elsewhere) and writes a
 * `SALIDA_ANULACION_COMPRA` movement per line for full traceability.
 * Deliberately does NOT touch `products.cost_price`/`public_price` or
 * `product_presentations.cost_price`/`public_price` — those are
 * "last write wins" fields with no history table, so a precise reversal is
 * not generally possible if a later purchase already overwrote them; the
 * correct price is restored by registering the new, correct purchase
 * afterward, not by this function guessing at a prior value.
 *
 * Blocks voiding a CREDITO purchase that was already marked as paid
 * (`payment_status = 'PAID'`) — a CONTADO purchase is always `PAID` from
 * the moment it's created (see `confirm_purchase`), which is NOT what this
 * guard is about: it only fires when a real, separate "Marcar como pagada"
 * action already happened after the original registration (real money
 * already given to the supplier), which is genuinely risky to undo blindly.
 */
export class AddVoidToPurchases1760001900000 implements MigrationInterface {
  name = 'AddVoidToPurchases1760001900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE purchases
        ADD COLUMN invoice_number VARCHAR(50) NULL,
        ADD COLUMN is_voided BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN voided_at TIMESTAMPTZ NULL,
        ADD COLUMN voided_by UUID NULL,
        ADD COLUMN void_reason VARCHAR(255) NULL,
        ADD CONSTRAINT "FK_purchases_voided_by" FOREIGN KEY (voided_by) REFERENCES users(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_purchases_void_consistency" CHECK (
          (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR
          (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_purchases_invoice_number" ON purchases (invoice_number);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_purchase(
        p_purchase_id UUID,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_purchase RECORD;
        v_detail RECORD;
        v_current_stock INT;
        v_current_location_stock INT;
        v_revert_qty INT;
        v_presentation_id UUID;
        v_bodega_id UUID;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, payment_type, payment_status, is_voided
        INTO v_purchase
        FROM purchases WHERE id = p_purchase_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'PURCHASE_NOT_FOUND:%', p_purchase_id; END IF;
        IF v_purchase.is_voided THEN RAISE EXCEPTION 'PURCHASE_ALREADY_VOIDED:%', p_purchase_id; END IF;
        IF v_purchase.payment_type = 'CREDITO' AND v_purchase.payment_status = 'PAID' THEN
          RAISE EXCEPTION 'PURCHASE_HAS_PAYMENT:%', p_purchase_id;
        END IF;

        SELECT id INTO v_bodega_id FROM inventory_locations WHERE name = 'Bodega';

        FOR v_detail IN
          SELECT product_id, presentation_id, location_id, quantity,
                 COALESCE(quantity_base_units, quantity) AS quantity_base_units,
                 COALESCE(conversion_factor, 1) AS conversion_factor
          FROM purchase_details
          WHERE purchase_id = p_purchase_id
          ORDER BY product_id
        LOOP
          v_revert_qty := v_detail.quantity_base_units;

          PERFORM 1 FROM products WHERE id = v_detail.product_id FOR UPDATE;
          SELECT stock INTO v_current_stock FROM products WHERE id = v_detail.product_id;
          IF v_current_stock IS NULL OR v_current_stock < v_revert_qty THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK_TO_REVERT:%', v_detail.product_id;
          END IF;
          UPDATE products SET stock = stock - v_revert_qty WHERE id = v_detail.product_id;

          IF v_detail.location_id IS NOT NULL THEN
            SELECT quantity INTO v_current_location_stock
              FROM inventory_stock
              WHERE product_id = v_detail.product_id AND location_id = v_detail.location_id
              FOR UPDATE;
            IF v_current_location_stock IS NULL OR v_current_location_stock < v_revert_qty THEN
              RAISE EXCEPTION 'INSUFFICIENT_STOCK_TO_REVERT:%', v_detail.product_id;
            END IF;
            UPDATE inventory_stock SET quantity = quantity - v_revert_qty, updated_at = now()
              WHERE product_id = v_detail.product_id AND location_id = v_detail.location_id;
          END IF;

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
            (v_detail.product_id, v_presentation_id, COALESCE(v_detail.location_id, v_bodega_id), NULL,
             'SALIDA_ANULACION_COMPRA', v_detail.quantity, v_detail.conversion_factor, v_revert_qty,
             'PURCHASE_VOID', p_purchase_id, p_user_id, p_reason);
        END LOOP;

        UPDATE purchases
          SET is_voided = true, voided_at = now(), voided_by = p_user_id, void_reason = trim(p_reason)
          WHERE id = p_purchase_id;

        RETURN p_purchase_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS void_purchase(UUID, UUID, VARCHAR)');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_purchases_invoice_number"');
    await queryRunner.query(`
      ALTER TABLE purchases
        DROP CONSTRAINT IF EXISTS "CHK_purchases_void_consistency",
        DROP CONSTRAINT IF EXISTS "FK_purchases_voided_by",
        DROP COLUMN IF EXISTS void_reason,
        DROP COLUMN IF EXISTS voided_by,
        DROP COLUMN IF EXISTS voided_at,
        DROP COLUMN IF EXISTS is_voided,
        DROP COLUMN IF EXISTS invoice_number;
    `);
  }
}
