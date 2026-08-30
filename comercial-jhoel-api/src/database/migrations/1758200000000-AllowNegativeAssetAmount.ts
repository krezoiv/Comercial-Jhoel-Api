import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Drops the `assets.amount > 0` guardrail — and only that one, on only
 * that one table. `accounts_receivable`'s identical-looking
 * `CHK_accounts_receivable_amount_positive` is untouched, per this
 * ticket's explicit "únicamente para este input" scope. This is a schema
 * change (dropping a CHECK constraint), but a purely additive/permissive
 * one: it removes a restriction, never a column, table, or row — every
 * existing `assets` row (all of them already positive, since the
 * constraint held until now) is completely unaffected.
 *
 * No `numeric` type change needed: `numeric(12,2)` already stores
 * negative values natively — the constraint was the only thing rejecting
 * them.
 */
export class AllowNegativeAssetAmount1758200000000
  implements MigrationInterface
{
  name = 'AllowNegativeAssetAmount1758200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "assets" DROP CONSTRAINT "CHK_assets_amount_positive"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "assets" ADD CONSTRAINT "CHK_assets_amount_positive" CHECK ("amount" > 0)',
    );
  }
}
