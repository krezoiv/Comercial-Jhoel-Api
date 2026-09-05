import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Stock mínimo" per (product, location) — the prerequisite for the
 * low-inventory alert. Added directly to `inventory_stock` rather than a
 * new table: that table is already exactly the grain needed (one row per
 * product×location, guaranteed to exist for every active product via
 * `InventoryStockRepository.createInitial()`), so a new table would just be
 * a redundant one-to-one shadow of an existing one. Every existing row
 * defaults to `min_stock = 0`, which the Alerts module treats as "no
 * threshold configured, never alert for this row" — byte-identical to
 * today's actual (no alert) behavior for every product until an admin
 * explicitly sets a real minimum.
 */
export class AddMinStockToInventoryStock1760000100000 implements MigrationInterface {
  name = 'AddMinStockToInventoryStock1760000100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventory_stock
        ADD COLUMN min_stock INT NOT NULL DEFAULT 0,
        ADD CONSTRAINT "CHK_inventory_stock_min_stock_non_negative" CHECK (min_stock >= 0);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventory_stock
        DROP CONSTRAINT IF EXISTS "CHK_inventory_stock_min_stock_non_negative",
        DROP COLUMN IF EXISTS min_stock;
    `);
  }
}
