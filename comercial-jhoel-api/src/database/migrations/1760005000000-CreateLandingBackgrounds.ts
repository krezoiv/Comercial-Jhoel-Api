import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Fondos de Landing" (Sistema → Fondos de Landing) — capas visuales de
 * profundidad (imagen + opacidad + overlay + posición/tamaño + efecto 3D +
 * parallax + movimiento) asignadas a una sección real de la landing
 * pública. Mismo shape BYTEA de imagen que `catalog_banks`/`news_articles`
 * (contenido editorial autónomo, sin FK a otra entidad de negocio) con las
 * columnas de configuración visual agregadas.
 *
 * `UQ_landing_backgrounds_section_active` (índice único parcial,
 * `WHERE is_active = true`) es la garantía real de "una sección solo puede
 * tener un fondo activo a la vez" — mismo patrón que
 * `UQ_products_sku_active`/`UQ_sales_open_per_user`; el pre-check en
 * `CreateLandingBackgroundUseCase`/`SetLandingBackgroundActiveUseCase` es
 * el rechazo rápido y amigable, esto es lo que lo hace correcto incluso
 * bajo una carrera.
 *
 * Puramente aditiva — no toca ninguna tabla existente.
 */
export class CreateLandingBackgrounds1760005000000 implements MigrationInterface {
  name = 'CreateLandingBackgrounds1760005000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE landing_backgrounds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        section_key VARCHAR(40) NOT NULL,
        image_data BYTEA NULL,
        image_mime_type VARCHAR(50) NULL,
        image_size_bytes INTEGER NULL,
        opacity SMALLINT NOT NULL DEFAULT 25 CHECK (opacity BETWEEN 0 AND 100),
        overlay VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (overlay IN ('none','subtle','medium','strong')),
        "position" VARCHAR(20) NOT NULL DEFAULT 'center' CHECK ("position" IN ('center','center-left','center-right','top','bottom')),
        size VARCHAR(10) NOT NULL DEFAULT 'large' CHECK (size IN ('small','medium','large','cover')),
        depth_effect VARCHAR(10) NOT NULL DEFAULT 'subtle' CHECK (depth_effect IN ('none','subtle','medium','deep')),
        parallax VARCHAR(10) NOT NULL DEFAULT 'subtle' CHECK (parallax IN ('off','subtle','medium')),
        movement VARCHAR(12) NOT NULL DEFAULT 'scroll_mouse' CHECK (movement IN ('static','floating','scroll','mouse','scroll_mouse')),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_landing_backgrounds_section_active"
      ON landing_backgrounds (section_key) WHERE is_active = true
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_landing_backgrounds_section"
      ON landing_backgrounds (section_key, is_active)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS landing_backgrounds');
  }
}
