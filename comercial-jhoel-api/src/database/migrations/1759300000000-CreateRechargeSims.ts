import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * SIM Claro / SIM Tigo — physical, stock-tracked products administered
 * EXCLUSIVELY from Recargas Electrónicas, never from the general
 * `products`/Inventario/Compras/Ventas modules (confirmed by direct code
 * read before writing this migration: `GET /products` has no default
 * exclusion, `InventoryPageComponent` fetches unconditionally, and
 * `confirm_sale`/`confirm_purchase` operate on `products.stock` with no
 * business/category scoping — a SIM row living in `products` would be
 * exposed to all of that with zero extra code. See Heladería's
 * `ice_creams` table for the proven precedent of a fully independent
 * physical-product family with its own stock/stored functions).
 *
 * Deliberately lives inside THIS module (not a new one) so it can reuse,
 * with zero new code, the exact same day-lifecycle gate every other
 * Recargas write function already uses: `recharge_day_openings.closed_at`.
 * This means "Gestión de Días de Recargas" (already built, already tested)
 * opens/closes/reopens SIM operations automatically together with the
 * electronic balance side — no new day-lifecycle table, function, or UI.
 *
 * `recharge_sim_types` is a 2-row lookup (mirrors `recharge_types` exactly)
 * — NOT one table per SIM type, per the ticket's explicit instruction.
 * Prices are fixed, seeded here, and read server-side by the purchase/sale
 * functions below — never accepted from the client, closing off any
 * price-tampering vector without needing a price-edit endpoint at all.
 *
 * `recharge_sim_daily_stock` mirrors `recharge_daily_balances` but has no
 * `final_balance`/`sequence` — physical stock never "closes and resets"
 * the way a cash balance does, it simply carries forward continuously from
 * whatever the previous day's `current_stock` ended at.
 */
export class CreateRechargeSims1759300000000 implements MigrationInterface {
  name = 'CreateRechargeSims1759300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recharge_sim_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'public_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_sim_types',
      new TableIndex({
        name: 'UQ_recharge_sim_types_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    await queryRunner.query(`
      INSERT INTO recharge_sim_types (name, cost_price, public_price) VALUES
        ('SIM Claro', 0.01, 5.00),
        ('SIM Tigo', 5.00, 15.00);
    `);

    await queryRunner.createTable(
      new Table({
        name: 'recharge_sim_daily_stock',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sim_type_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'previous_stock', type: 'integer' },
          { name: 'current_stock', type: 'integer' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_sim_daily_stock_type',
            columnNames: ['sim_type_id'],
            referencedTableName: 'recharge_sim_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sim_daily_stock_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sim_daily_stock_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_sim_daily_stock',
      new TableIndex({
        name: 'UQ_recharge_sim_daily_stock_type_date',
        columnNames: ['sim_type_id', 'date'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'recharge_sim_daily_stock',
      new TableIndex({
        name: 'IDX_recharge_sim_daily_stock_date',
        columnNames: ['date'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'recharge_sim_purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sim_type_id', type: 'uuid' },
          { name: 'daily_stock_id', type: 'uuid' },
          { name: 'quantity', type: 'integer' },
          { name: 'unit_cost', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total_cost', type: 'numeric', precision: 12, scale: 2 },
          { name: 'purchase_date', type: 'date' },
          { name: 'created_by', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_sim_purchases_type',
            columnNames: ['sim_type_id'],
            referencedTableName: 'recharge_sim_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sim_purchases_daily_stock',
            columnNames: ['daily_stock_id'],
            referencedTableName: 'recharge_sim_daily_stock',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_recharge_sim_purchases_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
    await queryRunner.createIndex(
      'recharge_sim_purchases',
      new TableIndex({
        name: 'IDX_recharge_sim_purchases_daily_stock_id',
        columnNames: ['daily_stock_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'recharge_sim_sales',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'sim_type_id', type: 'uuid' },
          { name: 'daily_stock_id', type: 'uuid' },
          { name: 'quantity', type: 'integer' },
          { name: 'unit_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total_amount', type: 'numeric', precision: 12, scale: 2 },
          { name: 'sale_date', type: 'date' },
          { name: 'created_by', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_sim_sales_type',
            columnNames: ['sim_type_id'],
            referencedTableName: 'recharge_sim_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sim_sales_daily_stock',
            columnNames: ['daily_stock_id'],
            referencedTableName: 'recharge_sim_daily_stock',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_recharge_sim_sales_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
    await queryRunner.createIndex(
      'recharge_sim_sales',
      new TableIndex({
        name: 'IDX_recharge_sim_sales_daily_stock_id',
        columnNames: ['daily_stock_id'],
      }),
    );

    // ensure_recharge_sim_daily_stock: finds today's stock row for this SIM
    // type, or lazily creates it with `previous_stock` copied from the most
    // recent PRIOR day's `current_stock` (0 for the genuine first-ever day)
    // — unlike ensure_recharge_daily_balance, there is no "must be closed"
    // condition on the source row, since SIM stock has no close/cycle step.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_recharge_sim_daily_stock(
        p_sim_type_id UUID,
        p_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_previous INTEGER;
      BEGIN
        SELECT id INTO v_id
        FROM recharge_sim_daily_stock
        WHERE sim_type_id = p_sim_type_id AND date = p_date;

        IF FOUND THEN
          RETURN v_id;
        END IF;

        SELECT current_stock INTO v_previous
        FROM recharge_sim_daily_stock
        WHERE sim_type_id = p_sim_type_id AND date < p_date
        ORDER BY date DESC
        LIMIT 1;

        v_previous := COALESCE(v_previous, 0);

        INSERT INTO recharge_sim_daily_stock
          (sim_type_id, date, previous_stock, current_stock, created_by)
        VALUES
          (p_sim_type_id, p_date, v_previous, v_previous, p_user_id)
        ON CONFLICT (sim_type_id, date) DO NOTHING
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
          SELECT id INTO v_id
          FROM recharge_sim_daily_stock
          WHERE sim_type_id = p_sim_type_id AND date = p_date;
        END IF;

        RETURN v_id;
      END;
      $fn$;
    `);

    // register_recharge_sim_purchase: same recharge_day_openings gate every
    // other Recargas write function already uses. Cost is ALWAYS read from
    // recharge_sim_types server-side — never accepted from the client.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sim_purchase(
        p_sim_type_id UUID,
        p_date DATE,
        p_quantity INTEGER,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_stock_id UUID;
        v_day_closed_at TIMESTAMPTZ;
        v_total_cost NUMERIC(12,2);
      BEGIN
        SELECT id, is_active, cost_price INTO v_type FROM recharge_sim_types WHERE id = p_sim_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SIM_TYPE_NOT_FOUND:%', p_sim_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'SIM_TYPE_INACTIVE:%', p_sim_type_id;
        END IF;

        IF p_quantity IS NULL OR p_quantity <= 0 THEN
          RAISE EXCEPTION 'INVALID_SIM_QUANTITY:%', p_sim_type_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        v_daily_stock_id := ensure_recharge_sim_daily_stock(p_sim_type_id, p_date, p_user_id);

        PERFORM 1 FROM recharge_sim_daily_stock WHERE id = v_daily_stock_id FOR UPDATE;

        v_total_cost := v_type.cost_price * p_quantity;

        INSERT INTO recharge_sim_purchases
          (sim_type_id, daily_stock_id, quantity, unit_cost, total_cost, purchase_date, created_by)
        VALUES
          (p_sim_type_id, v_daily_stock_id, p_quantity, v_type.cost_price, v_total_cost, p_date, p_user_id);

        UPDATE recharge_sim_daily_stock
        SET current_stock = current_stock + p_quantity,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_stock_id;

        RETURN v_daily_stock_id;
      END;
      $fn$;
    `);

    // register_recharge_sim_sale: same day gate, row-locked stock check
    // enforced in SQL (never trusts the frontend's own client-side check).
    // Price is ALWAYS read from recharge_sim_types server-side.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sim_sale(
        p_sim_type_id UUID,
        p_date DATE,
        p_quantity INTEGER,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_stock_id UUID;
        v_day_closed_at TIMESTAMPTZ;
        v_current_stock INTEGER;
        v_total_amount NUMERIC(12,2);
      BEGIN
        SELECT id, is_active, public_price INTO v_type FROM recharge_sim_types WHERE id = p_sim_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SIM_TYPE_NOT_FOUND:%', p_sim_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'SIM_TYPE_INACTIVE:%', p_sim_type_id;
        END IF;

        IF p_quantity IS NULL OR p_quantity <= 0 THEN
          RAISE EXCEPTION 'INVALID_SIM_QUANTITY:%', p_sim_type_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at FROM recharge_day_openings WHERE date = p_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_date;
        END IF;

        v_daily_stock_id := ensure_recharge_sim_daily_stock(p_sim_type_id, p_date, p_user_id);

        SELECT current_stock INTO v_current_stock
        FROM recharge_sim_daily_stock
        WHERE id = v_daily_stock_id
        FOR UPDATE;

        IF v_current_stock < p_quantity THEN
          RAISE EXCEPTION 'INSUFFICIENT_SIM_STOCK:%', p_sim_type_id;
        END IF;

        v_total_amount := v_type.public_price * p_quantity;

        INSERT INTO recharge_sim_sales
          (sim_type_id, daily_stock_id, quantity, unit_price, total_amount, sale_date, created_by)
        VALUES
          (p_sim_type_id, v_daily_stock_id, p_quantity, v_type.public_price, v_total_amount, p_date, p_user_id);

        UPDATE recharge_sim_daily_stock
        SET current_stock = current_stock - p_quantity,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_stock_id;

        RETURN v_daily_stock_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sim_sale(UUID, DATE, INTEGER, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sim_purchase(UUID, DATE, INTEGER, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS ensure_recharge_sim_daily_stock(UUID, DATE, UUID)',
    );
    await queryRunner.dropTable('recharge_sim_sales');
    await queryRunner.dropTable('recharge_sim_purchases');
    await queryRunner.dropTable('recharge_sim_daily_stock');
    await queryRunner.dropTable('recharge_sim_types');
  }
}
