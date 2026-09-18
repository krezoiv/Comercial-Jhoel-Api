import { MigrationInterface, QueryRunner } from 'typeorm';

const COMBINING_DIACRITICAL_MARKS = new RegExp('[̀-ͯ]', 'g');

/** Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya usado en el resto del proyecto, para que el backfill de esta migración no dependa de código de aplicación que puede cambiar después. */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_DIACRITICAL_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Toda noticia debe tener UNA clasificación obligatoria (`news_type_id`) y
 * una URL pública real (`slug`) — ninguna de las dos existía hasta ahora.
 *
 * Backfill no destructivo: cada noticia existente se asigna al tipo
 * semilla "Comercial" (creado por la migración anterior) — la opción más
 * segura, ya que "Comercial" está diseñado para representar exactamente
 * "aplica a todas las noticias". El slug se genera una sola vez a partir
 * del título real de cada noticia, con sufijo `-2`/`-3`... si colisiona —
 * nunca se inventa un título nuevo.
 */
export class AddNewsTypeAndSlugToNewsArticles1760003800000 implements MigrationInterface {
  name = 'AddNewsTypeAndSlugToNewsArticles1760003800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news_articles" ADD COLUMN "news_type_id" uuid`);
    await queryRunner.query(`ALTER TABLE "news_articles" ADD COLUMN "slug" varchar(220)`);

    const [comercial]: [{ id: string }] = await queryRunner.query(
      `SELECT id FROM "news_types" WHERE slug = 'comercial' LIMIT 1`,
    );
    if (!comercial) {
      throw new Error(
        'AddNewsTypeAndSlugToNewsArticles: no se encontró el tipo semilla "Comercial" — ¿corrió CreateNewsTypes antes?',
      );
    }
    await queryRunner.query(`UPDATE "news_articles" SET "news_type_id" = $1 WHERE "news_type_id" IS NULL`, [
      comercial.id,
    ]);

    const rows: Array<{ id: string; title: string }> = await queryRunner.query(
      `SELECT id, title FROM "news_articles" ORDER BY created_at ASC`,
    );
    const usedSlugs = new Set<string>();
    for (const row of rows) {
      const base = slugify(row.title) || 'noticia';
      let candidate = base;
      let suffix = 2;
      while (usedSlugs.has(candidate)) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(candidate);
      await queryRunner.query(`UPDATE "news_articles" SET "slug" = $1 WHERE id = $2`, [candidate, row.id]);
    }

    await queryRunner.query(`ALTER TABLE "news_articles" ALTER COLUMN "news_type_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "news_articles" ALTER COLUMN "slug" SET NOT NULL`);
    await queryRunner.query(`
      ALTER TABLE "news_articles"
      ADD CONSTRAINT "FK_news_articles_news_type"
      FOREIGN KEY ("news_type_id") REFERENCES "news_types"("id") ON DELETE RESTRICT
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "UQ_news_articles_slug" ON "news_articles" ("slug")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_news_articles_slug"');
    await queryRunner.query('ALTER TABLE "news_articles" DROP CONSTRAINT IF EXISTS "FK_news_articles_news_type"');
    await queryRunner.query('ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "slug"');
    await queryRunner.query('ALTER TABLE "news_articles" DROP COLUMN IF EXISTS "news_type_id"');
  }
}
