import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Catálogo maestro y configurable de "Tipos de Noticias" — nunca un enum
 * rígido: el admin puede crear/editar/activar/desactivar/ordenar filas
 * nuevas (Eventos, Avisos, ...) sin ninguna migración ni cambio de código.
 * Mismo escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/
 * `clients` para unicidad case-insensitive de `name`/`slug`.
 *
 * `is_wildcard` es el mecanismo central de la regla "Comercial = recibe
 * todas las noticias" (ver `CreateNewsSubscriptions` y
 * `CreateNewsNotificationsForArticleUseCase`) — puesto en `true`
 * únicamente aquí, para la fila semilla "Comercial". Ningún endpoint
 * permite editarlo después.
 */
export class CreateNewsTypes1760003700000 implements MigrationInterface {
  name = 'CreateNewsTypes1760003700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "news_types" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(50) NOT NULL,
        "slug" varchar(50) NOT NULL,
        "description" varchar(255),
        "is_wildcard" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
        "updated_by" uuid REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_types_name_active"
      ON "news_types" (LOWER("name"))
      WHERE "is_active" = true
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_types_slug_active"
      ON "news_types" (LOWER("slug"))
      WHERE "is_active" = true
    `);
    // A lo sumo un wildcard activo a la vez — la regla "Comercial = todas"
    // depende de que esto nunca sea ambiguo.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_types_wildcard_active"
      ON "news_types" ("is_wildcard")
      WHERE "is_wildcard" = true AND "is_active" = true
    `);

    await queryRunner.query(`
      INSERT INTO "news_types" ("name", "slug", "description", "is_wildcard", "sort_order", "created_by")
      SELECT 'Comercial', 'comercial', 'Recibe todas las noticias publicadas, sin importar su clasificación.', true, 0,
             (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
    `);
    await queryRunner.query(`
      INSERT INTO "news_types" ("name", "slug", "description", "sort_order", "created_by")
      SELECT 'Educativa', 'educativa', 'Noticias educativas — ciclo escolar, útiles, eventos académicos.', 1,
             (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
    `);
    await queryRunner.query(`
      INSERT INTO "news_types" ("name", "slug", "description", "sort_order", "created_by")
      SELECT 'Promociones', 'promociones', 'Ofertas y promociones especiales.', 2,
             (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "news_types"');
  }
}
