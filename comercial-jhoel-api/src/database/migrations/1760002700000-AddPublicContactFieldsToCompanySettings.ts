import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the fields the public landing page's "Contacto" section needs that
 * `company_settings` didn't have yet: `whatsapp` (deliberately separate
 * from `phone` — a business can call one number and answer WhatsApp on
 * another), `website`, `business_hours` (free multiline text, not a
 * structured day-by-day model — the admin types exactly what they want
 * shown), and `facebook_url`/`instagram_url`/`tiktok_url` (structured,
 * one URL per platform — supersedes the older free-text `social_media`
 * column for this purpose; that column is left untouched, still editable,
 * not migrated/renamed).
 *
 * All six are nullable with no default — the table's one existing row
 * simply gets `NULL` for each until an admin fills them in via
 * "Configuración de Empresa". Zero impact on existing data.
 */
export class AddPublicContactFieldsToCompanySettings1760002700000 implements MigrationInterface {
  name = 'AddPublicContactFieldsToCompanySettings1760002700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE company_settings
        ADD COLUMN whatsapp VARCHAR(20),
        ADD COLUMN website VARCHAR(255),
        ADD COLUMN business_hours TEXT,
        ADD COLUMN facebook_url VARCHAR(255),
        ADD COLUMN instagram_url VARCHAR(255),
        ADD COLUMN tiktok_url VARCHAR(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE company_settings
        DROP COLUMN IF EXISTS whatsapp,
        DROP COLUMN IF EXISTS website,
        DROP COLUMN IF EXISTS business_hours,
        DROP COLUMN IF EXISTS facebook_url,
        DROP COLUMN IF EXISTS instagram_url,
        DROP COLUMN IF EXISTS tiktok_url;
    `);
  }
}
