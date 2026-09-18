import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Catálogo público informativo "Bancos" (Sistema → Catálogo de Bancos) —
 * imagen, nombre, descripción, información adicional. Mismo shape que
 * `news_articles` (contenido editorial autónomo, sin FK a otra entidad de
 * negocio), con `additional_info` agregado.
 *
 * IMPORTANTE: completamente independiente de la tabla financiera `banks`
 * (Cuadre de Agentes — `previous_balance`/`final_balance`) y de
 * `transaction_banks`/`bank_deposit_operations` — esta migración no toca
 * ninguna de esas tablas, y `catalog_banks` no tiene ninguna FK hacia
 * ellas. Puramente aditiva.
 */
export class CreateCatalogBanks1760004000000 implements MigrationInterface {
  name = 'CreateCatalogBanks1760004000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE catalog_banks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        description TEXT NULL,
        additional_info TEXT NULL,
        image_data BYTEA NULL,
        image_mime_type VARCHAR(50) NULL,
        image_size_bytes INTEGER NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_banks_published" ON catalog_banks (is_active, sort_order)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS catalog_banks');
  }
}
