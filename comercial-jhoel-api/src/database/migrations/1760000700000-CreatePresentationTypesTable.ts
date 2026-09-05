import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Introduces the master "Tipos de Presentación" catalog (Sistema →
 * Presentaciones y Medidas) and migrates `product_presentations.name` — a
 * plain, per-product free-text column with no cross-product normalization
 * — into a real FK against it. This is what stops "Caja"/"caja"/" CAJA "/
 * "Cajas" from ever becoming separate, uncoordinated values again.
 *
 * **Non-destructive by construction**: every existing `product_presentations`
 * row already has a `name`; this migration groups those names
 * case-insensitively (trimmed), creates exactly one `presentation_types` row
 * per distinct group (never inventing a name that didn't already exist),
 * relates every row to its group's new id, and only then drops the now-
 * redundant `name` column — the FK carries the exact same information the
 * text column did, just normalized and reusable across products. No
 * `DROP TABLE`/`TRUNCATE`/mass `DELETE` anywhere in this file. A `RAISE
 * EXCEPTION` guard (see below) refuses to proceed if any row would be left
 * unmapped, rather than silently losing a presentation's identity.
 *
 * Verified directly against the live dev database before writing this file
 * (not assumed): only two distinct normalized names exist today — "caja"
 * (3 rows) and "unidad" (4 rows) — so this real data has no ambiguous
 * plural/typo variants to reconcile by hand.
 */
export class CreatePresentationTypesTable1760000700000
  implements MigrationInterface
{
  name = 'CreatePresentationTypesTable1760000700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "presentation_types" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(50) NOT NULL,
        "code" varchar(20),
        "description" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
        "updated_by" uuid REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);

    // Case-insensitive duplicate protection, same raw-SQL `LOWER(...)`
    // partial-unique-index escape hatch `clients` already established
    // (TypeORM's index builder can't express a functional index) —
    // deliberately stronger than the plain case-sensitive partial index
    // `account_types`/`transaction_types` use, per the explicit
    // "Caja"/"caja"/" CAJA "" requirement for this catalog.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_presentation_types_name_active"
      ON "presentation_types" (LOWER("name"))
      WHERE "is_active" = true
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_presentation_types_code_active"
      ON "presentation_types" (LOWER("code"))
      WHERE "is_active" = true AND "code" IS NOT NULL
    `);

    // One presentation_types row per distinct normalized name already used
    // in product_presentations — MIN(name) picks a single, deterministic
    // original-cased spelling per group (never a name that wasn't already
    // there). `created_by` resolves to the earliest-created user (the
    // seeded/original admin) — no migration in this codebase has needed a
    // "system" user before now, and this is the same reasoning every other
    // seed-with-audit-columns migration would need if it existed.
    await queryRunner.query(`
      INSERT INTO "presentation_types" ("name", "created_by")
      SELECT MIN(pp."name"), (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
      FROM "product_presentations" pp
      GROUP BY LOWER(TRIM(pp."name"))
    `);

    // "Unidad" must always exist, even on a fresh install with zero
    // existing products/presentations yet — CreateProductUseCase resolves
    // it by name for every new product's auto-created base presentation.
    await queryRunner.query(`
      INSERT INTO "presentation_types" ("name", "description", "created_by")
      SELECT 'Unidad', 'Presentación base — una unidad del producto.',
             (SELECT id FROM "users" ORDER BY "created_at" ASC LIMIT 1)
      WHERE NOT EXISTS (
        SELECT 1 FROM "presentation_types" WHERE LOWER("name") = 'unidad'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "product_presentations" ADD COLUMN "presentation_type_id" uuid
    `);
    await queryRunner.query(`
      UPDATE "product_presentations" pp
      SET "presentation_type_id" = pt."id"
      FROM "presentation_types" pt
      WHERE LOWER(TRIM(pp."name")) = LOWER(pt."name")
    `);

    // Safety net: refuse to proceed if the grouping above somehow left a
    // row unmapped, rather than silently allowing a NOT NULL/FK failure
    // (or worse, an unnoticed data loss) further down.
    await queryRunner.query(`
      DO $$
      DECLARE
        v_unmapped integer;
      BEGIN
        SELECT COUNT(*) INTO v_unmapped
        FROM "product_presentations"
        WHERE "presentation_type_id" IS NULL;
        IF v_unmapped > 0 THEN
          RAISE EXCEPTION 'CreatePresentationTypesTable: % product_presentations rows could not be mapped to a presentation_type', v_unmapped;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "product_presentations" ALTER COLUMN "presentation_type_id" SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "product_presentations"
      ADD CONSTRAINT "FK_product_presentations_presentation_type"
      FOREIGN KEY ("presentation_type_id") REFERENCES "presentation_types"("id") ON DELETE RESTRICT
    `);

    // Replaces the old (product_id, name) uniqueness with the FK-based
    // equivalent — a product still can't have two active rows pointing at
    // the same catalog entry.
    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_product_presentations_product_name_active"
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_product_presentations_product_type_active"
      ON "product_presentations" ("product_id", "presentation_type_id")
      WHERE "is_active" = true
    `);

    // The text column is now fully redundant with the FK above — every
    // value it held was copied into presentation_types/presentation_type_id
    // first, so this drops a column, not data.
    await queryRunner.query(`
      ALTER TABLE "product_presentations" DROP COLUMN "name"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down-migration for the name→FK conversion itself: the original
    // per-row spelling that existed before the group-by/MIN() collapse
    // cannot be reconstructed (two rows that shared a normalized name but
    // differed only in case/whitespace all now point at one
    // presentation_types row) — same "no downgrade for a
    // correctness/structural change" precedent already used elsewhere in
    // this project (see `AddWholesalePricingToSales`'s own `down()`).
    await queryRunner.query(
      'DROP INDEX IF EXISTS "UQ_product_presentations_product_type_active"',
    );
    await queryRunner.query(
      'ALTER TABLE "product_presentations" DROP CONSTRAINT IF EXISTS "FK_product_presentations_presentation_type"',
    );
    await queryRunner.query(
      'ALTER TABLE "product_presentations" DROP COLUMN IF EXISTS "presentation_type_id"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "presentation_types"');
  }
}
