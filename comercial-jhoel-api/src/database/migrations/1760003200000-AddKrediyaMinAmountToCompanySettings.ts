import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * `company_settings.krediya_min_amount` — the one global, singleton
 * business parameter the "Catálogo de Teléfonos" credit rule reads:
 * a phone qualifies for "Crédito con Krediya" when its price is
 * `>= krediya_min_amount`. Lives here (not a new config table) following
 * this codebase's own documented convention — a genuinely global threshold
 * belongs on the one true settings singleton, same home as `whatsapp`/
 * `businessHours`, while a *per-entity* threshold (stock mínimo, saldo
 * mínimo) lives on its own owning row instead.
 *
 * Nullable, no default constraint on the column itself — `NULL` or `<= 0`
 * both mean "crédito Krediya no ofrecido" (see
 * `isKrediyaCreditAvailable`), which lets the business turn the whole
 * offer off later without losing the previously configured number. The
 * `UPDATE` below only seeds the initial value (Q1,000) onto the existing
 * singleton row so the feature has a sane default from day one.
 */
export class AddKrediyaMinAmountToCompanySettings1760003200000 implements MigrationInterface {
  name = 'AddKrediyaMinAmountToCompanySettings1760003200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE company_settings ADD COLUMN krediya_min_amount NUMERIC(12,2) NULL`,
    );
    await queryRunner.query(
      `UPDATE company_settings SET krediya_min_amount = 1000`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE company_settings DROP COLUMN krediya_min_amount`,
    );
  }
}
