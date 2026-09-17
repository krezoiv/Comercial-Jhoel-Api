import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Catálogo de Librería" y "Variedades y Accesorios" — dos catálogos
 * públicos de la landing que NUNCA duplican un producto: `catalog_products`
 * es puramente la capa de "publicación" (INVENTARIO → PRODUCTO →
 * PUBLICACIÓN EN CATÁLOGO), con `product_id` como única fuente de verdad
 * para nombre/precio/categoría/negocio — esos siguen viviendo y
 * gestionándose por completo en `modules/products` (Inventario), sin
 * ningún cambio ahí.
 *
 * Una sola tabla para ambas secciones (`section` distingue
 * `LIBRERIA`/`VARIEDADES_ACCESORIOS`) — comparten ~95% de la forma
 * (imagen, descripción de catálogo, orden, activo/inactivo); lo que NO
 * comparten (WhatsApp/solicitudes solo en Variedades) se aplica como regla
 * de negocio en la capa de aplicación/presentación, nunca en el esquema.
 *
 * `image_data` BYTEA — mismo precedente ya usado por `catalog_phone_images`
 * (no existe almacenamiento de archivos en este proyecto; el contenedor de
 * producción no tiene volumen persistente). Una sola imagen por publicación
 * (a diferencia de la galería de Teléfonos) — el alcance pedido aquí es
 * "imagen" en singular, no una galería.
 *
 * Sin `is_published` separado de `is_active`: a diferencia de Teléfonos
 * (que sí requería un paso explícito de "Publicar" distinto de "Activar"),
 * el alcance pedido para Librería/Variedades es solo "estado
 * activo/inactivo" — un único flag controla visibilidad pública y gestión
 * admin, evitando un segundo estado que nadie pidió.
 *
 * `catalog_product_requests` — leads de "Lo quiero" para Variedades y
 * Accesorios, deliberadamente SIN nada de Krediya (sin `credit_available`,
 * sin distinción compra/crédito) — Librería nunca genera solicitudes
 * (sección puramente informativa), así que esta tabla nunca referencia una
 * publicación de sección `LIBRERIA` en la práctica (validado en la capa de
 * aplicación, no aquí).
 */
export class CreateProductCatalogModule1760003300000
  implements MigrationInterface
{
  name = 'CreateProductCatalogModule1760003300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE catalog_products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        section VARCHAR(30) NOT NULL CHECK (section IN ('LIBRERIA', 'VARIEDADES_ACCESORIOS')),
        catalog_description TEXT NULL,
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
      CREATE INDEX "IDX_catalog_products_section_active" ON catalog_products (section, is_active, sort_order)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_products_product_id" ON catalog_products (product_id)
    `);

    await queryRunner.query(`
      CREATE TABLE catalog_product_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        catalog_product_id UUID NOT NULL REFERENCES catalog_products(id) ON DELETE RESTRICT,
        product_name VARCHAR(150) NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'NUEVA'
          CHECK (status IN ('NUEVA', 'CONTACTADA', 'EN_PROCESO', 'ATENDIDA', 'CANCELADA')),
        observation VARCHAR(500) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_product_requests_status" ON catalog_product_requests (status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS catalog_product_requests');
    await queryRunner.query('DROP TABLE IF EXISTS catalog_products');
  }
}
