import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Reemplaza el contador ciego (`likes_count`, incrementado por un delta que
 * el frontend decide a partir de `localStorage`) por una tabla real de
 * "quién le dio like a qué": un visitante anónimo (identificado por un UUID
 * opaco que el propio frontend genera y persiste, mandado como header
 * `X-Visitor-Id`) puede tener a lo sumo un like por ítem — la PK compuesta
 * es la restricción anti-duplicado, no una revisión desde la aplicación.
 * La PK también sirve de índice para `COUNT(*) WHERE entity_type=$1 AND
 * entity_id=$2` (coincide con su prefijo), así que no hace falta un índice
 * aparte. Sin FK polimórfica hacia `catalog_phones`/`catalog_products`/
 * `news_articles` — la existencia/estado del ítem se valida en la capa de
 * aplicación, igual que ya hacen los use cases existentes de like.
 *
 * Las columnas `likes_count` de `catalog_phones`/`catalog_products`/
 * `news_articles` (migración `AddLikesToPublicCatalogEntities`) se dejan
 * intactas a propósito — dejan de leerse/escribirse (el conteo real ahora
 * sale de esta tabla), pero no se ejecuta ningún `DROP COLUMN` aquí.
 */
export class CreateCatalogLikes1760003600000 implements MigrationInterface {
  name = 'CreateCatalogLikes1760003600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE catalog_likes (
        entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('PHONE', 'PRODUCT', 'NEWS')),
        entity_id UUID NOT NULL,
        visitor_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_catalog_likes" PRIMARY KEY (entity_type, entity_id, visitor_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE catalog_likes`);
  }
}
