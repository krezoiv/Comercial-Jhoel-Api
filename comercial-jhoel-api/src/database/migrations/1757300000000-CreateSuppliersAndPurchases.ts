import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSuppliersAndPurchases1757300000000 implements MigrationInterface {
  name = 'CreateSuppliersAndPurchases1757300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'suppliers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '150', isNullable: true },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'tax_id', type: 'varchar', length: '50', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    // Partial unique index: a NIT/tax id is unique only among *active*
    // suppliers, same pattern as products.sku — a deactivated supplier's tax
    // id can be reused by a new supplier record.
    await queryRunner.createIndex(
      'suppliers',
      new TableIndex({
        name: 'UQ_suppliers_tax_id_active',
        columnNames: ['tax_id'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'supplier_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'purchase_date', type: 'timestamptz' },
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
            name: 'FK_purchases_supplier',
            columnNames: ['supplier_id'],
            referencedTableName: 'suppliers',
            referencedColumnNames: ['id'],
            // Suppliers are soft-deleted, so this never actually fires —
            // same RESTRICT-by-default rule as every other FK in this app.
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_purchases_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            // A purchase is a financial record — never lost just because the
            // clerk's account is later removed (also soft-deleted, so this
            // never actually fires either).
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'purchase_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'purchase_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'public_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_purchase_details_purchase',
            columnNames: ['purchase_id'],
            referencedTableName: 'purchases',
            referencedColumnNames: ['id'],
            // A purchase's line items have no independent existence.
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_purchase_details_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'purchases',
      new TableIndex({
        name: 'IDX_purchases_supplier_id',
        columnNames: ['supplier_id'],
      }),
    );
    await queryRunner.createIndex(
      'purchases',
      new TableIndex({
        name: 'IDX_purchases_user_id',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'purchases',
      new TableIndex({
        name: 'IDX_purchases_purchase_date',
        columnNames: ['purchase_date'],
      }),
    );
    await queryRunner.createIndex(
      'purchase_details',
      new TableIndex({
        name: 'IDX_purchase_details_purchase_id',
        columnNames: ['purchase_id'],
      }),
    );
    await queryRunner.createIndex(
      'purchase_details',
      new TableIndex({
        name: 'IDX_purchase_details_product_id',
        columnNames: ['product_id'],
      }),
    );

    // ------------------------------------------------------------------
    // confirm_purchase: the single atomic operation that creates a
    // purchase, its line items, increases stock, and updates the
    // product's current cost/public price to what this invoice says.
    //
    // FUNCTION, not PROCEDURE — same reasoning as confirm_sale() in the
    // Sales module: this must succeed or fail as one indivisible unit, and
    // a FUNCTION already gets that for free (it runs inside the caller's
    // transaction; any RAISE EXCEPTION rolls back every write it made, no
    // explicit BEGIN/COMMIT needed) while also returning the new purchase's
    // id directly from a plain SELECT.
    //
    // Unlike confirm_sale(), increasing stock is never rejectable — there's
    // no "oversell" equivalent when adding inventory, so this function
    // doesn't need to *check* a value before deciding whether the operation
    // is allowed. It still locks each product row with SELECT ... FOR
    // UPDATE before touching it, which is what makes the read-is_active +
    // write-stock/prices sequence for that product safe under concurrency —
    // two simultaneous purchases of the same product simply serialize, and
    // `stock = stock + quantity` is correct either order, so no update is
    // ever lost.
    // ------------------------------------------------------------------
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
        v_quantity INT;
        v_cost_price NUMERIC(12,2);
        v_public_price NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_purchase_total NUMERIC(12,2) := 0;
        v_product RECORD;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'PURCHASE_EMPTY';
        END IF;

        SELECT id, is_active INTO v_supplier FROM suppliers WHERE id = p_supplier_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SUPPLIER_NOT_FOUND:%', p_supplier_id;
        END IF;
        IF NOT v_supplier.is_active THEN
          RAISE EXCEPTION 'SUPPLIER_INACTIVE:%', p_supplier_id;
        END IF;

        INSERT INTO purchases (supplier_id, user_id, purchase_date, total)
        VALUES (p_supplier_id, p_user_id, p_purchase_date, 0)
        RETURNING id INTO v_purchase_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          v_cost_price := (v_item->>'costPrice')::NUMERIC(12,2);
          v_public_price := (v_item->>'publicPrice')::NUMERIC(12,2);

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;
          IF v_cost_price IS NULL OR v_cost_price < 0 OR v_public_price IS NULL OR v_public_price < 0 THEN
            RAISE EXCEPTION 'INVALID_PRICE:%', v_product_id;
          END IF;

          SELECT id, is_active INTO v_product FROM products WHERE id = v_product_id FOR UPDATE;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id;
          END IF;
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id;
          END IF;

          -- Purchase line totals use cost price, never public price — the
          -- cost of goods received is what a purchase invoice actually is.
          v_line_total := v_cost_price * v_quantity;
          v_purchase_total := v_purchase_total + v_line_total;

          INSERT INTO purchase_details (purchase_id, product_id, quantity, cost_price, public_price, total)
          VALUES (v_purchase_id, v_product_id, v_quantity, v_cost_price, v_public_price, v_line_total);

          -- Stock increases by exactly what was purchased; the product's
          -- current prices become whatever this invoice says (frozen,
          -- historical copies already live in purchase_details above and
          -- never change after this).
          UPDATE products
          SET stock = stock + v_quantity,
              cost_price = v_cost_price,
              public_price = v_public_price
          WHERE id = v_product_id;
        END LOOP;

        UPDATE purchases SET total = v_purchase_total WHERE id = v_purchase_id;

        RETURN v_purchase_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_purchase(UUID, UUID, TIMESTAMPTZ, JSONB)',
    );
    await queryRunner.dropTable('purchase_details');
    await queryRunner.dropTable('purchases');
    await queryRunner.dropTable('suppliers');
  }
}
