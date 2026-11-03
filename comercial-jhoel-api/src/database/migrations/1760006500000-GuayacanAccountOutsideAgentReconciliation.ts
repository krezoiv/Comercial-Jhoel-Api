import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * La cuenta de Cooperativa Guayacán tiene su propio cuadre (Cuadre de Caja
 * Guayacán): NO entra en Cuadre de Agentes — ni en el desglose de bancos ni
 * en sus totales, ni se exige su saldo del día para cerrar.
 *
 * Se identifica con una cuenta especial nueva, `banks.special_account =
 * 'GUAYACAN'` (seleccionable en Sistema → Bancos), nunca por nombre en el
 * código. Esta migración la marca sola solo si hay exactamente UNA cuenta
 * activa sin cuenta especial cuyo nombre normalizado contiene "guayacan";
 * si no, se marca a mano en Sistema → Bancos.
 *
 * `GUAYACAN` no cambia ninguna regla de saldo (`apply_bank_account_movement`
 * la trata como una cuenta normal) ni de transferencias. Solo se amplían el
 * CHECK y el índice de "una sola activa" — DDL, ningún saldo ni movimiento
 * se toca.
 *
 * `down` quita la marca (vuelve a cuenta normal) y restaura el CHECK/índice.
 */
export class GuayacanAccountOutsideAgentReconciliation1760006500000 implements MigrationInterface {
  name = 'GuayacanAccountOutsideAgentReconciliation1760006500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE banks
        DROP CONSTRAINT IF EXISTS "CHK_banks_special_account",
        ADD CONSTRAINT "CHK_banks_special_account" CHECK (
          special_account IS NULL OR special_account IN (
            'GENESIS', 'BI_CLUB', 'DISTRICOL', 'BANCO_INDUSTRIAL', 'BANCO_AGROMERCANTIL', 'GUAYACAN'
          )
        )
    `);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_banks_special_account_single_active"`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_banks_special_account_single_active"
        ON banks (special_account)
        WHERE is_active = true AND special_account IN ('GENESIS', 'BI_CLUB', 'DISTRICOL', 'GUAYACAN')
    `);
    await queryRunner.query(`
      WITH candidates AS (
        SELECT id FROM banks
        WHERE is_active AND special_account IS NULL AND search_normalize(name) LIKE '%guayacan%'
      )
      UPDATE banks SET special_account = 'GUAYACAN', updated_at = now()
      WHERE id = (SELECT id FROM candidates)
        AND (SELECT count(*) FROM candidates) = 1
        AND NOT EXISTS (SELECT 1 FROM banks WHERE special_account = 'GUAYACAN' AND is_active)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE banks SET special_account = NULL WHERE special_account = 'GUAYACAN'`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_banks_special_account_single_active"`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_banks_special_account_single_active"
        ON banks (special_account)
        WHERE is_active = true AND special_account IN ('GENESIS', 'BI_CLUB', 'DISTRICOL')
    `);
    await queryRunner.query(`
      ALTER TABLE banks
        DROP CONSTRAINT IF EXISTS "CHK_banks_special_account",
        ADD CONSTRAINT "CHK_banks_special_account" CHECK (
          special_account IS NULL OR special_account IN (
            'GENESIS', 'BI_CLUB', 'DISTRICOL', 'BANCO_INDUSTRIAL', 'BANCO_AGROMERCANTIL'
          )
        )
    `);
  }
}
