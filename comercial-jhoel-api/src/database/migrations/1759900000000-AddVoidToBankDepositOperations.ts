import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Anular" a Transaccionar operation — the correction mechanism for a mistaken
 * registration, deliberately NOT an edit and NOT a physical DELETE (same
 * philosophy as `cancel_agent_day`/every other soft-delete in this codebase:
 * a financial record is never rewritten or removed, only marked). Purely
 * additive: every existing row defaults to `is_voided = false`, byte-identical
 * to today's actual (implicit) behavior — nothing is backfilled beyond that
 * default.
 *
 * A voided operation is NOT deleted and NOT hidden from the operations list —
 * it stays visible (with a status badge on the frontend) for audit purposes,
 * it is only excluded from Reportería's summary/aggregate totals (see
 * `TypeOrmBankDepositRepository.getReportSummary`), the same way a CANCELLED
 * day doesn't count toward Cuadre de Agentes' own totals.
 *
 * No stored function needed for the void action itself — "does this operation
 * exist, is it already voided" is checked in `VoidBankDepositOperationUseCase`
 * before a single conditional `UPDATE`, the same "don't build a procedure
 * where a plain statement is already correct and simpler" call already made
 * for `confirm_open_sale`'s own status transition (see the backend CLAUDE.md).
 */
export class AddVoidToBankDepositOperations1759900000000 implements MigrationInterface {
  name = 'AddVoidToBankDepositOperations1759900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        ADD COLUMN is_voided BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN voided_at TIMESTAMPTZ NULL,
        ADD COLUMN voided_by UUID NULL,
        ADD COLUMN void_reason TEXT NULL,
        ADD CONSTRAINT "FK_bank_deposit_operations_voided_by" FOREIGN KEY (voided_by) REFERENCES users(id) ON DELETE RESTRICT,
        ADD CONSTRAINT "CHK_bank_deposit_operations_void_consistency"
          CHECK (
            (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
            OR
            (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
          );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_bank_deposit_operations_is_voided" ON bank_deposit_operations (is_voided);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_bank_deposit_operations_is_voided";
    `);
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        DROP CONSTRAINT IF EXISTS "CHK_bank_deposit_operations_void_consistency",
        DROP CONSTRAINT IF EXISTS "FK_bank_deposit_operations_voided_by",
        DROP COLUMN IF EXISTS void_reason,
        DROP COLUMN IF EXISTS voided_by,
        DROP COLUMN IF EXISTS voided_at,
        DROP COLUMN IF EXISTS is_voided;
    `);
  }
}
