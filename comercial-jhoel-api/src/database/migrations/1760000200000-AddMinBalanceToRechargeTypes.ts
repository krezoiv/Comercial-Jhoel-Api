import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Saldo mínimo" per recharge type (Claro/Tigo, extensible) — the
 * prerequisite for the low-recharge-balance alert. Added directly to
 * `recharge_types` rather than a separate settings table: it's already the
 * one row per operator, and a third operator later just gets its own
 * `min_balance` on its own seeded row, no schema change needed — same
 * "config lives on the entity it configures" choice already made for
 * `inventory_stock.min_stock`. Defaults to `0`, which the Alerts module
 * treats as "no threshold configured, never alert" — identical to today's
 * actual (no alert) behavior until an admin sets a real minimum.
 */
export class AddMinBalanceToRechargeTypes1760000200000 implements MigrationInterface {
  name = 'AddMinBalanceToRechargeTypes1760000200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_types
        ADD COLUMN min_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
        ADD CONSTRAINT "CHK_recharge_types_min_balance_non_negative" CHECK (min_balance >= 0);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_types
        DROP CONSTRAINT IF EXISTS "CHK_recharge_types_min_balance_non_negative",
        DROP COLUMN IF EXISTS min_balance;
    `);
  }
}
