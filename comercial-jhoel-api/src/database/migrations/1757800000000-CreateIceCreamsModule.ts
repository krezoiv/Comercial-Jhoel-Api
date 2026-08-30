import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateIceCreamsModule1757800000000 implements MigrationInterface {
  name = 'CreateIceCreamsModule1757800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ice_creams',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sku', type: 'varchar', length: '64' },
          { name: 'product', type: 'varchar', length: '150' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'public_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_ice_creams_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_ice_creams_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Same partial-unique-active pattern as `products.sku`/`products.name`:
    // a deactivated helado's SKU/name can be reused by a new one, matching
    // this codebase's established soft-delete convention.
    await queryRunner.createIndex(
      'ice_creams',
      new TableIndex({
        name: 'UQ_ice_creams_sku_active',
        columnNames: ['sku'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );
    await queryRunner.createIndex(
      'ice_creams',
      new TableIndex({
        name: 'UQ_ice_creams_product_active',
        columnNames: ['product'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    await queryRunner.query(`
      ALTER TABLE ice_creams
        ADD CONSTRAINT CHK_ice_creams_cost_price_non_negative CHECK (cost_price >= 0),
        ADD CONSTRAINT CHK_ice_creams_public_price_non_negative CHECK (public_price >= 0),
        ADD CONSTRAINT CHK_ice_creams_stock_non_negative CHECK (stock >= 0);
    `);

    // ------------------------------------------------------------------
    // ice_cream_purchases / ice_cream_purchase_details — same normalized
    // header+detail shape as purchases/purchase_details.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'ice_cream_purchases',
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
            name: 'FK_ice_cream_purchases_supplier',
            columnNames: ['supplier_id'],
            referencedTableName: 'suppliers',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_ice_cream_purchases_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'ice_cream_purchase_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'purchase_id', type: 'uuid' },
          { name: 'ice_cream_id', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'subtotal', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_ice_cream_purchase_details_purchase',
            columnNames: ['purchase_id'],
            referencedTableName: 'ice_cream_purchases',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_ice_cream_purchase_details_ice_cream',
            columnNames: ['ice_cream_id'],
            referencedTableName: 'ice_creams',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // ------------------------------------------------------------------
    // ice_cream_sales / ice_cream_sale_details — same shape as
    // sales/sale_details.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'ice_cream_sales',
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
            name: 'FK_ice_cream_sales_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'ice_cream_sale_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sale_id', type: 'uuid' },
          { name: 'ice_cream_id', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'unit_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_ice_cream_sale_details_sale',
            columnNames: ['sale_id'],
            referencedTableName: 'ice_cream_sales',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_ice_cream_sale_details_ice_cream',
            columnNames: ['ice_cream_id'],
            referencedTableName: 'ice_creams',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'ice_cream_purchases',
      new TableIndex({
        name: 'IDX_ice_cream_purchases_supplier_id',
        columnNames: ['supplier_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_purchases',
      new TableIndex({
        name: 'IDX_ice_cream_purchases_user_id',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_purchases',
      new TableIndex({
        name: 'IDX_ice_cream_purchases_purchase_date',
        columnNames: ['purchase_date'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_purchase_details',
      new TableIndex({
        name: 'IDX_ice_cream_purchase_details_purchase_id',
        columnNames: ['purchase_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_purchase_details',
      new TableIndex({
        name: 'IDX_ice_cream_purchase_details_ice_cream_id',
        columnNames: ['ice_cream_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_sales',
      new TableIndex({
        name: 'IDX_ice_cream_sales_user_id',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_sales',
      new TableIndex({
        name: 'IDX_ice_cream_sales_sale_date',
        columnNames: ['sale_date'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_sale_details',
      new TableIndex({
        name: 'IDX_ice_cream_sale_details_sale_id',
        columnNames: ['sale_id'],
      }),
    );
    await queryRunner.createIndex(
      'ice_cream_sale_details',
      new TableIndex({
        name: 'IDX_ice_cream_sale_details_ice_cream_id',
        columnNames: ['ice_cream_id'],
      }),
    );

    // ------------------------------------------------------------------
    // confirm_ice_cream_purchase: same atomic shape as confirm_purchase()
    // (see that migration's own doc comment for the FUNCTION-vs-PROCEDURE
    // reasoning) — creates the purchase, its line items, increases stock,
    // and updates the helado's current cost price to what this invoice
    // says. Each helado row is locked with FOR UPDATE before being touched,
    // same as confirm_purchase() — increasing stock is never rejectable, so
    // the lock exists only to make the read-is_active + write-stock/price
    // sequence safe under concurrency, not to guard against a negative
    // result.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_ice_cream_purchase(
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
        v_ice_cream_id UUID;
        v_quantity INT;
        v_cost_price NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_purchase_total NUMERIC(12,2) := 0;
        v_ice_cream RECORD;
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

        INSERT INTO ice_cream_purchases (supplier_id, user_id, purchase_date, total)
        VALUES (p_supplier_id, p_user_id, p_purchase_date, 0)
        RETURNING id INTO v_purchase_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_ice_cream_id := (v_item->>'iceCreamId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          v_cost_price := (v_item->>'costPrice')::NUMERIC(12,2);

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_ice_cream_id;
          END IF;
          IF v_cost_price IS NULL OR v_cost_price < 0 THEN
            RAISE EXCEPTION 'INVALID_PRICE:%', v_ice_cream_id;
          END IF;

          SELECT id, is_active INTO v_ice_cream FROM ice_creams WHERE id = v_ice_cream_id FOR UPDATE;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'ICE_CREAM_NOT_FOUND:%', v_ice_cream_id;
          END IF;
          IF NOT v_ice_cream.is_active THEN
            RAISE EXCEPTION 'ICE_CREAM_INACTIVE:%', v_ice_cream_id;
          END IF;

          v_line_total := v_cost_price * v_quantity;
          v_purchase_total := v_purchase_total + v_line_total;

          INSERT INTO ice_cream_purchase_details (purchase_id, ice_cream_id, quantity, cost_price, subtotal)
          VALUES (v_purchase_id, v_ice_cream_id, v_quantity, v_cost_price, v_line_total);

          -- Stock increases by exactly what was purchased; the helado's
          -- current cost price becomes whatever this invoice says (frozen,
          -- historical copy already lives in ice_cream_purchase_details
          -- above and never changes after this). Public price is untouched
          -- here — it's only ever changed through the CRUD edit screen.
          UPDATE ice_creams
          SET stock = stock + v_quantity,
              cost_price = v_cost_price,
              updated_by = p_user_id,
              updated_at = now()
          WHERE id = v_ice_cream_id;
        END LOOP;

        UPDATE ice_cream_purchases SET total = v_purchase_total WHERE id = v_purchase_id;

        RETURN v_purchase_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // confirm_ice_cream_sale: same atomic + concurrency-safe shape as
    // confirm_sale() (see that migration's own doc comment) — each helado
    // row is locked with FOR UPDATE before its stock is checked, so two
    // concurrent sales of the last unit can never both succeed.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_ice_cream_sale(p_user_id UUID, p_items JSONB)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_item JSONB;
        v_ice_cream_id UUID;
        v_quantity INT;
        v_ice_cream RECORD;
        v_unit_price NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_sale_total NUMERIC(12,2) := 0;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'SALE_EMPTY';
        END IF;

        INSERT INTO ice_cream_sales (user_id, sale_date, total)
        VALUES (p_user_id, now(), 0)
        RETURNING id INTO v_sale_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_ice_cream_id := (v_item->>'iceCreamId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_ice_cream_id;
          END IF;

          -- Row lock: blocks a concurrent sale of the same helado until
          -- this transaction finishes, so the stock check below is safe.
          SELECT id, is_active, stock, public_price INTO v_ice_cream
          FROM ice_creams
          WHERE id = v_ice_cream_id
          FOR UPDATE;

          IF NOT FOUND THEN
            RAISE EXCEPTION 'ICE_CREAM_NOT_FOUND:%', v_ice_cream_id;
          END IF;

          IF NOT v_ice_cream.is_active THEN
            RAISE EXCEPTION 'ICE_CREAM_INACTIVE:%', v_ice_cream_id;
          END IF;

          IF v_ice_cream.stock < v_quantity THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', v_ice_cream_id;
          END IF;

          -- Unit price is always the helado's current public price at the
          -- moment of sale — never trusted from the caller. Once written to
          -- ice_cream_sale_details it's frozen; a later price change never
          -- touches it.
          v_unit_price := v_ice_cream.public_price;
          v_line_total := v_unit_price * v_quantity;
          v_sale_total := v_sale_total + v_line_total;

          INSERT INTO ice_cream_sale_details (sale_id, ice_cream_id, quantity, unit_price, total)
          VALUES (v_sale_id, v_ice_cream_id, v_quantity, v_unit_price, v_line_total);

          UPDATE ice_creams SET stock = stock - v_quantity WHERE id = v_ice_cream_id;
        END LOOP;

        UPDATE ice_cream_sales SET total = v_sale_total WHERE id = v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_ice_cream_sale(UUID, JSONB)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS confirm_ice_cream_purchase(UUID, UUID, TIMESTAMPTZ, JSONB)',
    );
    await queryRunner.dropTable('ice_cream_sale_details');
    await queryRunner.dropTable('ice_cream_sales');
    await queryRunner.dropTable('ice_cream_purchase_details');
    await queryRunner.dropTable('ice_cream_purchases');
    await queryRunner.dropTable('ice_creams');
  }
}
