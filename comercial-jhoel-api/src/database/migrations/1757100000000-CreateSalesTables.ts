import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSalesTables1757100000000 implements MigrationInterface {
  name = 'CreateSalesTables1757100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'sale_date', type: 'timestamptz', default: 'now()' },
          {
            name: 'total',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_sales_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            // A sale is a financial record — never lose it just because the
            // cashier's account is later removed (accounts are soft-deleted
            // anyway, so this never actually fires in practice).
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'sale_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sale_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'unit_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_sale_details_sale',
            columnNames: ['sale_id'],
            referencedTableName: 'sales',
            referencedColumnNames: ['id'],
            // A sale's line items have no independent existence — if the
            // parent sale row is ever removed, its details go with it.
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_sale_details_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            // Same RESTRICT-by-default rule as every other product FK —
            // products are soft-deleted, so this never actually fires.
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'sales',
      new TableIndex({ name: 'IDX_sales_user_id', columnNames: ['user_id'] }),
    );
    await queryRunner.createIndex(
      'sales',
      new TableIndex({
        name: 'IDX_sales_sale_date',
        columnNames: ['sale_date'],
      }),
    );
    await queryRunner.createIndex(
      'sale_details',
      new TableIndex({
        name: 'IDX_sale_details_sale_id',
        columnNames: ['sale_id'],
      }),
    );
    await queryRunner.createIndex(
      'sale_details',
      new TableIndex({
        name: 'IDX_sale_details_product_id',
        columnNames: ['product_id'],
      }),
    );

    // ------------------------------------------------------------------
    // confirm_sale: the single atomic operation that creates a sale, its
    // line items, and decrements stock.
    //
    // FUNCTION vs PROCEDURE: a PROCEDURE exists specifically so a caller can
    // COMMIT/ROLLBACK *inside* it, splitting one call into multiple
    // independent transactions (e.g. batch jobs that should keep already-
    // processed rows even if a later one fails). That's the opposite of
    // what a sale needs — "create sale + create details + decrement stock"
    // must succeed or fail as one indivisible unit. A FUNCTION runs entirely
    // inside the caller's transaction and cannot commit early, so a
    // RAISE EXCEPTION anywhere below automatically rolls back every write
    // this function made — no explicit BEGIN/COMMIT needed. It also returns
    // a value directly from a plain SELECT, which is what the repository
    // layer needs (the new sale's id) and is simpler to call than a
    // PROCEDURE's CALL/OUT-parameter form. FUNCTION is therefore the
    // technically correct choice here.
    //
    // Concurrency: each product row is locked with SELECT ... FOR UPDATE
    // before its stock is checked. A second, concurrent confirm_sale() call
    // for the same product blocks on that lock until the first transaction
    // commits or rolls back, then re-reads the now-current stock — so two
    // simultaneous sales for the last unit can never both succeed (no
    // negative stock, no overselling). The repository sorts items by
    // product_id before calling this function, so concurrent multi-item
    // sales always acquire their product locks in the same order, which
    // rules out lock-ordering deadlocks between them.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_sale(p_user_id UUID, p_items JSONB)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_product RECORD;
        v_unit_price NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_sale_total NUMERIC(12,2) := 0;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'SALE_EMPTY';
        END IF;

        INSERT INTO sales (user_id, sale_date, total)
        VALUES (p_user_id, now(), 0)
        RETURNING id INTO v_sale_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;

          -- Row lock: blocks a concurrent sale of the same product until
          -- this transaction finishes, so the stock check below is safe.
          SELECT id, is_active, stock, public_price INTO v_product
          FROM products
          WHERE id = v_product_id
          FOR UPDATE;

          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id;
          END IF;

          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id;
          END IF;

          IF v_product.stock < v_quantity THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', v_product_id;
          END IF;

          -- Unit price is always the product's current public price at the
          -- moment of sale — never trusted from the caller. Once written to
          -- sale_details it's frozen; a later price change never touches it.
          v_unit_price := v_product.public_price;
          v_line_total := v_unit_price * v_quantity;
          v_sale_total := v_sale_total + v_line_total;

          INSERT INTO sale_details (sale_id, product_id, quantity, unit_price, total)
          VALUES (v_sale_id, v_product_id, v_quantity, v_unit_price, v_line_total);

          UPDATE products SET stock = stock - v_quantity WHERE id = v_product_id;
        END LOOP;

        UPDATE sales SET total = v_sale_total WHERE id = v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_sale(UUID, JSONB)',
    );
    await queryRunner.dropTable('sale_details');
    await queryRunner.dropTable('sales');
  }
}
