import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Introduces the master "Unidades de Medida" catalog (Sistema →
 * Presentaciones y Medidas) and gives every product a required
 * `unit_of_measure_id` FK — a genuinely new concept, since no unit-of-
 * measure column, enum, or table existed anywhere in this project before
 * (confirmed by a full-project search before writing this migration, not
 * assumed). Deliberately separate from `presentation_types`
 * (`CreatePresentationTypesTable`) — a unit of measure describes the
 * physical unit a product is measured in (kg, L, unidad), not how it's
 * grouped/commercialized (Caja, Paquete); the two catalogs are never
 * mixed, per the ticket's own explicit requirement.
 *
 * Same non-destructive shape as `CreateBusinessesTable`'s own
 * `business_id` rollout: seed one default row ("Unidad", every existing
 * product had no unit before, so there is nothing to reconcile — no
 * grouping/ambiguity question here, unlike the presentation-name
 * migration), backfill every existing product to it, then enforce
 * NOT NULL. No `DROP TABLE`/`TRUNCATE`/mass `DELETE` anywhere in this file.
 */
export class CreateUnitsOfMeasureTable1760000800000
  implements MigrationInterface
{
  name = 'CreateUnitsOfMeasureTable1760000800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "units_of_measure" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(50) NOT NULL,
        "abbreviation" varchar(10) NOT NULL,
        "description" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
        "updated_by" uuid REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);

    // Same case-insensitive partial-unique-index pattern as
    // `presentation_types`/`clients` — on both `name` and `abbreviation`
    // independently, since either could collide ("Gramo"/"gramo" as much
    // as "g"/"G").
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_units_of_measure_name_active"
      ON "units_of_measure" (LOWER("name"))
      WHERE "is_active" = true
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_units_of_measure_abbreviation_active"
      ON "units_of_measure" (LOWER("abbreviation"))
      WHERE "is_active" = true
    `);

    // Seed the small starter set the ticket itself names as examples — an
    // admin can add more from the new screen. "Unidad" (und) is the one
    // every pre-existing product backfills to below, so it must exist
    // first.
    await queryRunner.query(`
      INSERT INTO "units_of_measure" ("name", "abbreviation", "description", "created_by")
      SELECT v.name, v.abbreviation, v.description, (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
      FROM (VALUES
        ('Unidad', 'und', 'Unidad individual del producto.'),
        ('Kilogramo', 'kg', NULL),
        ('Gramo', 'g', NULL),
        ('Litro', 'L', NULL),
        ('Mililitro', 'ml', NULL)
      ) AS v(name, abbreviation, description)
    `);

    await queryRunner.query(`
      ALTER TABLE "products" ADD COLUMN "unit_of_measure_id" uuid
    `);
    await queryRunner.query(`
      UPDATE "products"
      SET "unit_of_measure_id" = (SELECT id FROM "units_of_measure" WHERE LOWER("name") = 'unidad')
      WHERE "unit_of_measure_id" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "products" ALTER COLUMN "unit_of_measure_id" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_unit_of_measure"
      FOREIGN KEY ("unit_of_measure_id") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_unit_of_measure_id" ON "products" ("unit_of_measure_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_products_unit_of_measure_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_unit_of_measure"',
    );
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN IF EXISTS "unit_of_measure_id"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "units_of_measure"');
  }
}
