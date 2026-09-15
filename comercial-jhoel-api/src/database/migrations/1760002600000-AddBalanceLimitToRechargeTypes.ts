import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Límite de saldo" per recharge type (Claro/Tigo) — the 100% reference
 * point for the Resumen dashboard's saldo gauge charts. Added directly to
 * `recharge_types`, same pattern as `min_balance`: it's already the one row
 * per operator, so a third operator later just gets its own `balance_limit`
 * on its own seeded row, no schema change needed.
 *
 * Deliberately a SEPARATE column from `min_balance`, not a reuse of it —
 * `min_balance` is the Alerts module's "alert me when balance falls below
 * this" floor (already live in production); `balance_limit` is the opposite
 * concept, a ceiling/target the balance is expected to normally sit under
 * but is explicitly allowed to exceed (100%+). Sharing one column between
 * the two would break the Alerts module's existing semantics.
 *
 * Initial values (Claro Q1,000, Tigo Q600) are set for the two seeded rows
 * only — any other/future recharge type simply defaults to `0` until an
 * admin configures it, same "0 means unconfigured" convention `min_balance`
 * already established.
 */
export class AddBalanceLimitToRechargeTypes1760002600000 implements MigrationInterface {
  name = 'AddBalanceLimitToRechargeTypes1760002600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_types
        ADD COLUMN balance_limit NUMERIC(12,2) NOT NULL DEFAULT 0,
        ADD CONSTRAINT "CHK_recharge_types_balance_limit_non_negative" CHECK (balance_limit >= 0);
    `);

    await queryRunner.query(`
      UPDATE recharge_types SET balance_limit = 1000 WHERE name = 'Claro';
    `);
    await queryRunner.query(`
      UPDATE recharge_types SET balance_limit = 600 WHERE name = 'Tigo';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_types
        DROP CONSTRAINT IF EXISTS "CHK_recharge_types_balance_limit_non_negative",
        DROP COLUMN IF EXISTS balance_limit;
    `);
  }
}
