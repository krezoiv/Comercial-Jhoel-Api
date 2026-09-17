import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Noticias" — contenido informativo de la landing, deliberadamente NO
 * modelado como producto: sin `product_id`, sin precio, sin negocio/
 * categoría, sin WhatsApp, sin Krediya. Campos mínimos pedidos
 * explícitamente ("no agregar campos innecesarios si no aportan valor") —
 * sin `summary`/`category` propios: el extracto de la tarjeta pública se
 * deriva truncando `description` en el frontend, no se duplica en una
 * segunda columna.
 *
 * `description` es siempre texto plano — nunca HTML enriquecido. Angular
 * interpola texto de forma segura por defecto (nunca lo interpreta como
 * markup), así que esto es lo que hace innecesaria cualquier sanitización:
 * no hay superficie de XSS que cerrar porque nunca se acepta/renderiza HTML
 * en absoluto, en ningún punto del flujo.
 *
 * `image_data` BYTEA — mismo precedente que `catalog_phone_images`/
 * `catalog_products.image_data` (sin almacenamiento de archivos en este
 * proyecto). Una sola imagen por noticia.
 *
 * Sin `is_published` separado de `is_active` — mismo razonamiento que
 * `catalog_products`: el alcance pedido es solo "activo/inactivo".
 */
export class CreateNewsModule1760003400000 implements MigrationInterface {
  name = 'CreateNewsModule1760003400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE news_articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        published_at DATE NOT NULL DEFAULT CURRENT_DATE,
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        image_data BYTEA NULL,
        image_mime_type VARCHAR(50) NULL,
        image_size_bytes INTEGER NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_news_articles_published" ON news_articles (is_active, sort_order, published_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS news_articles');
  }
}
