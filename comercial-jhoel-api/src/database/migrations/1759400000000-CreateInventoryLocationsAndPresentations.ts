import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Evolves Inventario from "producto → stock global" to
 * "producto → presentaciones → ubicaciones → stock". Purely additive: no
 * existing table is dropped, no existing row is deleted or overwritten
 * destructively. `products.stock` is KEPT — it remains the running total,
 * now equal to `SUM(inventory_stock.quantity)` for that product, updated in
 * lockstep by every function below — so every existing reader of
 * `products.stock` (GET /products, Reportería's product-name resolution,
 * etc.) keeps working unchanged.
 *
 * New tables:
 * - `inventory_locations` — extensible list of stock locations, seeded with
 *   "Bodega"/"Vitrina". Adding a third location later is a plain INSERT,
 *   never a code/migration change.
 * - `product_presentations` — per-product configurable unit ("Unidad",
 *   "Caja", "Paquete", ...), each with its own conversion factor to base
 *   units and its own cost/public price. Every existing product gets an
 *   auto-created "Unidad" presentation (factor 1, current cost/public
 *   price) — this is what lets every existing Compras/Ventas call (which
 *   never sends a presentation) resolve to exactly today's behavior.
 * - `inventory_stock` — the new granular source of truth, in BASE UNITS,
 *   one row per (product, location). Backfilled: `Bodega = products.stock`
 *   (today's real value, not invented), `Vitrina = 0` — exactly the
 *   migration rule requested: never guess a historical physical
 *   distribution.
 * - `inventory_movements` — audit trail for CONFIRMED operations only
 *   (compra, venta confirmada, traslado) — never for in-flight cart
 *   adjustments, so the trail reflects real business events, not every
 *   provisional click.
 *
 * `sale_details`/`purchase_details` gain nullable `presentation_id`,
 * `location_id`, `conversion_factor`, `quantity_base_units` — historical
 * rows keep these NULL forever (never backfilled, per "no modificar
 * registros históricos"); new rows always populate them.
 *
 * `products.stock` and the new `inventory_stock.quantity` both gain
 * `CHECK (... >= 0)` — `products.stock` never had this constraint before
 * (confirmed by reading the live schema), a real gap this migration closes
 * defensively, consistent with `ice_creams.stock`'s own existing CHECK.
 */
export class CreateInventoryLocationsAndPresentations1759400000000 implements MigrationInterface {
  name = 'CreateInventoryLocationsAndPresentations1759400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // inventory_locations
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'inventory_locations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );
    await queryRunner.createIndex(
      'inventory_locations',
      new TableIndex({
        name: 'UQ_inventory_locations_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );
    await queryRunner.query(`
      INSERT INTO inventory_locations (name) VALUES ('Bodega'), ('Vitrina');
    `);

    // ------------------------------------------------------------------
    // product_presentations
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'product_presentations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'product_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'conversion_factor', type: 'int' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'public_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_product_presentations_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
    await queryRunner.query(`
      ALTER TABLE product_presentations ADD CONSTRAINT "CHK_product_presentations_factor_positive" CHECK (conversion_factor > 0);
    `);
    await queryRunner.createIndex(
      'product_presentations',
      new TableIndex({
        name: 'UQ_product_presentations_product_name_active',
        columnNames: ['product_id', 'name'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );
    await queryRunner.createIndex(
      'product_presentations',
      new TableIndex({
        name: 'IDX_product_presentations_product_id',
        columnNames: ['product_id'],
      }),
    );

    // Backfill: every existing product (active or not — a reactivated
    // product must already have its base presentation) gets its "Unidad"
    // presentation, mirroring the product's own current prices exactly.
    await queryRunner.query(`
      INSERT INTO product_presentations (product_id, name, conversion_factor, cost_price, public_price, is_active)
      SELECT id, 'Unidad', 1, cost_price, public_price, true FROM products;
    `);

    // ------------------------------------------------------------------
    // inventory_stock
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'inventory_stock',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'product_id', type: 'uuid' },
          { name: 'location_id', type: 'uuid' },
          { name: 'quantity', type: 'int', default: 0 },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_inventory_stock_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_inventory_stock_location',
            columnNames: ['location_id'],
            referencedTableName: 'inventory_locations',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
    await queryRunner.query(`
      ALTER TABLE inventory_stock ADD CONSTRAINT "CHK_inventory_stock_quantity_non_negative" CHECK (quantity >= 0);
    `);
    await queryRunner.createIndex(
      'inventory_stock',
      new TableIndex({
        name: 'UQ_inventory_stock_product_location',
        columnNames: ['product_id', 'location_id'],
        isUnique: true,
      }),
    );

    // Backfill: Bodega = the product's real current stock, Vitrina = 0 —
    // never an invented physical distribution.
    await queryRunner.query(`
      INSERT INTO inventory_stock (product_id, location_id, quantity)
      SELECT p.id, l.id, CASE WHEN l.name = 'Bodega' THEN p.stock ELSE 0 END
      FROM products p CROSS JOIN inventory_locations l;
    `);

    // ------------------------------------------------------------------
    // inventory_movements — audit trail, confirmed operations only
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'inventory_movements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'product_id', type: 'uuid' },
          { name: 'presentation_id', type: 'uuid' },
          { name: 'location_from_id', type: 'uuid', isNullable: true },
          { name: 'location_to_id', type: 'uuid', isNullable: true },
          { name: 'movement_type', type: 'varchar', length: '30' },
          { name: 'quantity_presentation', type: 'int' },
          { name: 'conversion_factor', type: 'int' },
          { name: 'quantity_base_units', type: 'int' },
          {
            name: 'reference_type',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          { name: 'reference_id', type: 'uuid', isNullable: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'reason', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_inventory_movements_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_inventory_movements_presentation',
            columnNames: ['presentation_id'],
            referencedTableName: 'product_presentations',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_inventory_movements_location_from',
            columnNames: ['location_from_id'],
            referencedTableName: 'inventory_locations',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_inventory_movements_location_to',
            columnNames: ['location_to_id'],
            referencedTableName: 'inventory_locations',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_inventory_movements_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
    await queryRunner.createIndex(
      'inventory_movements',
      new TableIndex({
        name: 'IDX_inventory_movements_product_id',
        columnNames: ['product_id'],
      }),
    );
    await queryRunner.createIndex(
      'inventory_movements',
      new TableIndex({
        name: 'IDX_inventory_movements_created_at',
        columnNames: ['created_at'],
      }),
    );
    await queryRunner.createIndex(
      'inventory_movements',
      new TableIndex({
        name: 'IDX_inventory_movements_reference_id',
        columnNames: ['reference_id'],
      }),
    );

    // ------------------------------------------------------------------
    // sale_details / purchase_details — additive, nullable columns only
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE sale_details
        ADD COLUMN presentation_id UUID NULL,
        ADD COLUMN location_id UUID NULL,
        ADD COLUMN conversion_factor INT NULL,
        ADD COLUMN quantity_base_units INT NULL,
        ADD CONSTRAINT "FK_sale_details_presentation" FOREIGN KEY (presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "FK_sale_details_location" FOREIGN KEY (location_id) REFERENCES inventory_locations(id) ON DELETE RESTRICT;
    `);
    await queryRunner.query(`
      ALTER TABLE purchase_details
        ADD COLUMN presentation_id UUID NULL,
        ADD COLUMN location_id UUID NULL,
        ADD COLUMN conversion_factor INT NULL,
        ADD COLUMN quantity_base_units INT NULL,
        ADD CONSTRAINT "FK_purchase_details_presentation" FOREIGN KEY (presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "FK_purchase_details_location" FOREIGN KEY (location_id) REFERENCES inventory_locations(id) ON DELETE RESTRICT;
    `);

    // ------------------------------------------------------------------
    // products.stock — close the missing non-negative guard (defense in
    // depth; application logic already prevents this, this is the DB-level
    // backstop `ice_creams.stock` already has and `products` never got).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE products ADD CONSTRAINT "CHK_products_stock_non_negative" CHECK (stock >= 0);
    `);

    // ==================================================================
    // Stored functions
    // ==================================================================

    // ensure_product_presentation: resolves an explicit presentation id
    // (validated against the product and active) or the product's own
    // "Unidad" row when NULL is passed — the single place every function
    // below shares for "what presentation, what factor" resolution.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_product_presentation(
        p_product_id UUID,
        p_presentation_id UUID
      )
      RETURNS product_presentations
      LANGUAGE plpgsql
      AS $fn$
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
          SELECT * INTO v_presentation
          FROM product_presentations
          WHERE product_id = p_product_id AND name = 'Unidad';
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRESENTATION_NOT_FOUND:%', p_product_id;
          END IF;
        END IF;
        RETURN v_presentation;
      END;
      $fn$;
    `);

    // ensure_inventory_stock_row: guarantees a (product, location) row
    // exists, then the CALLER locks it with its own FOR UPDATE — same
    // "insert, swallow unique_violation, let the caller lock" race pattern
    // already proven by ensure_recharge_daily_balance/adjust_sale_item's
    // own OPEN-sale creation elsewhere in this codebase.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_inventory_stock_row(
        p_product_id UUID,
        p_location_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      BEGIN
        BEGIN
          INSERT INTO inventory_stock (product_id, location_id, quantity)
          VALUES (p_product_id, p_location_id, 0);
        EXCEPTION WHEN unique_violation THEN
          NULL;
        END;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // confirm_purchase — same name/params; each item's JSONB gains an
    // optional "presentationId" (omitted = "Unidad", byte-identical
    // behavior to before this migration for every existing caller). Always
    // enters "Bodega". Factor always server-resolved; price still comes
    // from the client per line, preserving Compras' existing, deliberate
    // "the invoice sets the price" behavior — now scoped to whichever
    // presentation was actually purchased.
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

    // ------------------------------------------------------------------
    // adjust_sale_item — same name; gains two OPTIONAL trailing params
    // (NULL default). Omitted, resolves "Unidad" (price = products.public_price,
    // byte-identical to before) and "Vitrina". Matches sale_details by
    // (sale_id, product_id, presentation_id) instead of (sale_id, product_id)
    // — equivalent to before for the Unidad-only case, and what lets "5
    // unidades" + "1 caja" of the same product coexist as separate lines.
    // Stock is now validated against inventory_stock for the resolved
    // location, not the global products.stock — this is the one real,
    // ticket-required behavior change (ventas de mostrador salen de
    // Vitrina). Lock order preserved exactly: sales(OPEN) → products →
    // sale_details → inventory_stock.
    // ------------------------------------------------------------------
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

        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          BEGIN
            INSERT INTO sales (user_id, sale_date, total, status)
            VALUES (p_user_id, now(), 0, 'OPEN') RETURNING id INTO v_sale_id;
          EXCEPTION WHEN unique_violation THEN
            SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
          END;
        END IF;

        SELECT id, is_active, public_price INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', p_product_id; END IF;

        v_presentation := ensure_product_presentation(p_product_id, p_presentation_id);
        IF p_presentation_id IS NULL THEN
          v_unit_price := v_product.public_price;
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

    // ------------------------------------------------------------------
    // cancel_open_sale — restores each line to the location/base-units it
    // was actually reserved from (COALESCE'd to Vitrina/quantity for any
    // draft row that happens to predate this migration, so an in-flight
    // cart at deploy time is still handled safely without special-casing
    // deployment timing).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cancel_open_sale(p_user_id UUID)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_detail RECORD;
        v_vitrina_id UUID;
        v_location_id UUID;
        v_base_units INT;
      BEGIN
        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN RETURN FALSE; END IF;

        SELECT id INTO v_vitrina_id FROM inventory_locations WHERE name = 'Vitrina';

        FOR v_detail IN
          SELECT product_id, quantity, quantity_base_units, location_id
          FROM sale_details WHERE sale_id = v_sale_id
          ORDER BY product_id FOR UPDATE
        LOOP
          v_location_id := COALESCE(v_detail.location_id, v_vitrina_id);
          v_base_units := COALESCE(v_detail.quantity_base_units, v_detail.quantity);

          UPDATE products SET stock = stock + v_base_units WHERE id = v_detail.product_id;

          PERFORM ensure_inventory_stock_row(v_detail.product_id, v_location_id);
          UPDATE inventory_stock SET quantity = quantity + v_base_units, updated_at = now()
            WHERE product_id = v_detail.product_id AND location_id = v_location_id;
        END LOOP;

        DELETE FROM sale_details WHERE sale_id = v_sale_id;
        DELETE FROM sales WHERE id = v_sale_id;
        RETURN TRUE;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // confirm_open_sale — was a plain TypeScript UPDATE before this
    // migration; becomes a stored function so it can atomically write the
    // SALIDA_VENTA movement rows at the moment a draft actually becomes a
    // real, confirmed sale (never before — see the module doc comment on
    // why cart adjustments themselves don't write movements).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION confirm_open_sale(p_user_id UUID)
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale_id UUID;
        v_detail RECORD;
        v_vitrina_id UUID;
        v_unidad_id UUID;
      BEGIN
        SELECT id INTO v_sale_id FROM sales WHERE user_id = p_user_id AND status = 'OPEN' FOR UPDATE;
        IF NOT FOUND THEN
          RETURN NULL;
        END IF;

        SELECT id INTO v_vitrina_id FROM inventory_locations WHERE name = 'Vitrina';

        FOR v_detail IN
          SELECT product_id, presentation_id, quantity, quantity_base_units, conversion_factor, location_id
          FROM sale_details WHERE sale_id = v_sale_id
        LOOP
          IF v_detail.presentation_id IS NULL THEN
            SELECT id INTO v_unidad_id FROM product_presentations WHERE product_id = v_detail.product_id AND name = 'Unidad';
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
      $fn$;
    `);

    // ------------------------------------------------------------------
    // confirm_sale — bulk, one-shot path (no longer used by the live
    // Ventas screen, but remains tested public API — see CLAUDE.md). Same
    // presentation/location treatment as adjust_sale_item, and writes its
    // own movement rows immediately since a bulk sale has no draft phase.
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

        INSERT INTO sales (user_id, sale_date, total) VALUES (p_user_id, now(), 0)
        RETURNING id INTO v_sale_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;

          SELECT id, is_active, public_price INTO v_product FROM products WHERE id = v_product_id FOR UPDATE;
          IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id; END IF;
          IF NOT v_product.is_active THEN RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id; END IF;

          IF v_item ? 'presentationId' AND (v_item->>'presentationId') IS NOT NULL THEN
            v_presentation := ensure_product_presentation(v_product_id, (v_item->>'presentationId')::UUID);
            v_unit_price := v_presentation.public_price;
          ELSE
            v_presentation := ensure_product_presentation(v_product_id, NULL);
            v_unit_price := v_product.public_price;
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

    // ------------------------------------------------------------------
    // register_inventory_transfer — moves stock between two locations.
    // NEVER touches products.stock (a transfer changes location, not
    // total — the sum across locations is identical before and after, by
    // construction). Writes two movement rows sharing one reference_id so
    // the UI can group them as "Traslado #N".
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_inventory_transfer(
        p_product_id UUID,
        p_presentation_id UUID,
        p_from_location_id UUID,
        p_to_location_id UUID,
        p_quantity_presentation INT,
        p_user_id UUID,
        p_reason TEXT DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_product RECORD;
        v_presentation product_presentations;
        v_from RECORD;
        v_to RECORD;
        v_quantity_base INT;
        v_reference_id UUID;
        v_from_stock INT;
      BEGIN
        IF p_quantity_presentation IS NULL OR p_quantity_presentation <= 0 THEN
          RAISE EXCEPTION 'INVALID_QUANTITY:%', p_product_id;
        END IF;
        IF p_from_location_id = p_to_location_id THEN
          RAISE EXCEPTION 'SAME_LOCATION:%', p_product_id;
        END IF;

        SELECT id, is_active INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', p_product_id; END IF;
        IF NOT v_product.is_active THEN RAISE EXCEPTION 'PRODUCT_INACTIVE:%', p_product_id; END IF;

        SELECT id, is_active INTO v_from FROM inventory_locations WHERE id = p_from_location_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'LOCATION_NOT_FOUND:%', p_from_location_id; END IF;
        IF NOT v_from.is_active THEN RAISE EXCEPTION 'LOCATION_INACTIVE:%', p_from_location_id; END IF;

        SELECT id, is_active INTO v_to FROM inventory_locations WHERE id = p_to_location_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'LOCATION_NOT_FOUND:%', p_to_location_id; END IF;
        IF NOT v_to.is_active THEN RAISE EXCEPTION 'LOCATION_INACTIVE:%', p_to_location_id; END IF;

        v_presentation := ensure_product_presentation(p_product_id, p_presentation_id);
        v_quantity_base := p_quantity_presentation * v_presentation.conversion_factor;

        -- Lock origin then destination, in a fixed order (origin id <
        -- destination id) so two concurrent transfers of the same pair of
        -- locations (in either direction) can never deadlock against each
        -- other — same deadlock-avoidance principle already used by
        -- CreateSaleUseCase/CreatePurchaseUseCase's own productId sort.
        PERFORM ensure_inventory_stock_row(p_product_id, p_from_location_id);
        PERFORM ensure_inventory_stock_row(p_product_id, p_to_location_id);

        IF p_from_location_id < p_to_location_id THEN
          PERFORM 1 FROM inventory_stock WHERE product_id = p_product_id AND location_id = p_from_location_id FOR UPDATE;
          PERFORM 1 FROM inventory_stock WHERE product_id = p_product_id AND location_id = p_to_location_id FOR UPDATE;
        ELSE
          PERFORM 1 FROM inventory_stock WHERE product_id = p_product_id AND location_id = p_to_location_id FOR UPDATE;
          PERFORM 1 FROM inventory_stock WHERE product_id = p_product_id AND location_id = p_from_location_id FOR UPDATE;
        END IF;

        SELECT quantity INTO v_from_stock FROM inventory_stock
          WHERE product_id = p_product_id AND location_id = p_from_location_id;
        IF v_from_stock < v_quantity_base THEN
          RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', p_product_id;
        END IF;

        UPDATE inventory_stock SET quantity = quantity - v_quantity_base, updated_at = now()
          WHERE product_id = p_product_id AND location_id = p_from_location_id;
        UPDATE inventory_stock SET quantity = quantity + v_quantity_base, updated_at = now()
          WHERE product_id = p_product_id AND location_id = p_to_location_id;

        v_reference_id := gen_random_uuid();

        INSERT INTO inventory_movements
          (product_id, presentation_id, location_from_id, location_to_id, movement_type,
           quantity_presentation, conversion_factor, quantity_base_units,
           reference_type, reference_id, user_id, reason)
        VALUES
          (p_product_id, v_presentation.id, p_from_location_id, p_to_location_id, 'TRASLADO_SALIDA',
           p_quantity_presentation, v_presentation.conversion_factor, v_quantity_base,
           'TRANSFER', v_reference_id, p_user_id, p_reason);

        INSERT INTO inventory_movements
          (product_id, presentation_id, location_from_id, location_to_id, movement_type,
           quantity_presentation, conversion_factor, quantity_base_units,
           reference_type, reference_id, user_id, reason)
        VALUES
          (p_product_id, v_presentation.id, p_from_location_id, p_to_location_id, 'TRASLADO_ENTRADA',
           p_quantity_presentation, v_presentation.conversion_factor, v_quantity_base,
           'TRANSFER', v_reference_id, p_user_id, p_reason);

        RETURN v_reference_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // No functional downgrade provided — this migration closes real
    // correctness gaps (missing stock >= 0 guard, global-only stock model)
    // that existing rows may already have started depending on by the time
    // a rollback would run. Same "no downgrade for a correctness/structural
    // change" precedent already established in this project (see e.g.
    // AddRechargeDayGateToWriteFunctions' own down()).
  }
}
