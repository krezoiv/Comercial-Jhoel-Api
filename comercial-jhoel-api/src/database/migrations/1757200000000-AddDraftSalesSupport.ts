import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddDraftSalesSupport1757200000000 implements MigrationInterface {
  name = 'AddDraftSalesSupport1757200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Default 'CONFIRMED' on purpose: this backfills every pre-existing row
    // (all real, already-completed sales) as confirmed. New draft rows are
    // always inserted with an explicit status='OPEN' by adjust_sale_item()
    // below — the column default is only ever "confirmed unless told
    // otherwise", matching what the existing bulk confirm_sale() function
    // already does (it never sets status, so it gets this default).
    await queryRunner.addColumn(
      'sales',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: `'CONFIRMED'`,
      }),
    );

    // A user can have at most one open (in-progress) receipt at a time —
    // enforced at the DB level, not just by application logic, since
    // adjust_sale_item()'s "find or create" below could otherwise race.
    await queryRunner.createIndex(
      'sales',
      new TableIndex({
        name: 'UQ_sales_open_per_user',
        columnNames: ['user_id'],
        isUnique: true,
        where: `"status" = 'OPEN'`,
      }),
    );

    // ------------------------------------------------------------------
    // adjust_sale_item: the real-time counterpart to confirm_sale(). Called
    // once per cart action (add a product, +/-, direct quantity edit, remove)
    // instead of once at the very end — so `products.stock` reflects the
    // receipt being built immediately, for any other screen/terminal
    // reading it, not just after "Guardar venta".
    //
    // `p_quantity_delta` is the *change* to make to that product's line
    // quantity within the caller's own open receipt: positive to add/
    // increase (reserves stock), negative to decrease/remove (releases it
    // back). One function handles both directions symmetrically — the sign
    // of the stock adjustment is just the negation of the delta — rather
    // than having separate reserve/release endpoints, which would let a
    // caller release more than they ever reserved. Because the delta is
    // always applied against the *actual* current row (locked FOR UPDATE,
    // not a client-supplied absolute quantity), a stale frontend can never
    // desync real stock — the worst case is its own next request failing
    // with INSUFFICIENT_STOCK, never an incorrect stock value being written.
    //
    // Same FUNCTION-not-PROCEDURE and FOR-UPDATE-locking reasoning as
    // confirm_sale() above applies here — see that comment for the full
    // rationale; it's not repeated per function.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION adjust_sale_item(p_user_id UUID, p_product_id UUID, p_quantity_delta INT)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_product RECORD;
        v_detail RECORD;
        v_new_quantity INT;
        v_line_total NUMERIC(12,2);
      BEGIN
        IF p_quantity_delta = 0 THEN
          RAISE EXCEPTION 'INVALID_QUANTITY:%', p_product_id;
        END IF;

        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;

        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status)
            VALUES (p_user_id, now(), 0, 'OPEN')
            RETURNING id INTO v_sale_id;
          EXCEPTION WHEN unique_violation THEN
            -- A concurrent call from the same user (e.g. a double-click)
            -- just created the open sale first — reuse it instead of failing.
            SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
          END;
        END IF;

        SELECT id, is_active, stock, public_price INTO v_product
        FROM products
        WHERE id = p_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', p_product_id;
        END IF;

        SELECT id, quantity INTO v_detail
        FROM sale_details
        WHERE sale_id = v_sale_id AND product_id = p_product_id
        FOR UPDATE;

        v_new_quantity := COALESCE(v_detail.quantity, 0) + p_quantity_delta;

        IF v_new_quantity < 0 THEN
          RAISE EXCEPTION 'INVALID_QUANTITY:%', p_product_id;
        END IF;

        -- Only reserving *more* stock needs the active/sufficient-stock
        -- checks — releasing stock back is always allowed regardless of
        -- whether the product is still active.
        IF p_quantity_delta > 0 THEN
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', p_product_id;
          END IF;
          IF v_product.stock < p_quantity_delta THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', p_product_id;
          END IF;
        END IF;

        UPDATE products SET stock = stock - p_quantity_delta WHERE id = p_product_id;

        IF v_new_quantity = 0 THEN
          IF v_detail.id IS NOT NULL THEN
            DELETE FROM sale_details WHERE id = v_detail.id;
          END IF;
        ELSE
          v_line_total := v_product.public_price * v_new_quantity;
          IF v_detail.id IS NOT NULL THEN
            UPDATE sale_details
            SET quantity = v_new_quantity, unit_price = v_product.public_price, total = v_line_total
            WHERE id = v_detail.id;
          ELSE
            INSERT INTO sale_details (sale_id, product_id, quantity, unit_price, total)
            VALUES (v_sale_id, p_product_id, v_new_quantity, v_product.public_price, v_line_total);
          END IF;
        END IF;

        UPDATE sales
        SET total = COALESCE((SELECT SUM(total) FROM sale_details WHERE sale_id = v_sale_id), 0)
        WHERE id = v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // cancel_open_sale: the rollback side — discards the caller's open
    // receipt entirely, restoring every reserved line's quantity back to
    // its product's stock. An abandoned draft never represented a real
    // transaction, so it's hard-deleted (not soft-cancelled) rather than
    // kept as history — unlike a CONFIRMED sale, which is never deleted.
    // Returns FALSE (no-op) if the caller has no open receipt.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cancel_open_sale(p_user_id UUID)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_detail RECORD;
      BEGIN
        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          RETURN FALSE;
        END IF;

        FOR v_detail IN
          SELECT product_id, quantity FROM sale_details WHERE sale_id = v_sale_id ORDER BY product_id FOR UPDATE
        LOOP
          UPDATE products SET stock = stock + v_detail.quantity WHERE id = v_detail.product_id;
        END LOOP;

        DELETE FROM sale_details WHERE sale_id = v_sale_id;
        DELETE FROM sales WHERE id = v_sale_id;

        RETURN TRUE;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS cancel_open_sale(UUID)');
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS adjust_sale_item(UUID, UUID, INT)',
    );
    await queryRunner.dropIndex('sales', 'UQ_sales_open_per_user');
    await queryRunner.dropColumn('sales', 'status');
  }
}
