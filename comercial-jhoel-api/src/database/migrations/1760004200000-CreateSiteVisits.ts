import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Contador agregado y anónimo de visitas a la landing pública — una sola
 * fila (`id = 1`, forzado por el CHECK, mismo patrón singleton que
 * `alert_settings`/`company_settings`), nunca una fila por visita: el
 * pedido original es explícito en que solo se necesita el TOTAL, no un
 * historial. Sin datos personales, sin IP, sin identificador de
 * dispositivo — el backend solo sabe "ocurrió una visita más".
 *
 * El incremento (`UPDATE site_visits SET total_count = total_count + 1
 * WHERE id = 1`) es atómico por sí mismo — un `UPDATE` de una sola fila ya
 * es atómico en PostgreSQL, sin necesidad de una función almacenada (mismo
 * criterio ya documentado en este proyecto para `confirm_open_sale`'s
 * propia transición de estado: no crear un procedimiento donde una
 * sentencia simple ya es correcta).
 */
export class CreateSiteVisits1760004200000 implements MigrationInterface {
  name = 'CreateSiteVisits1760004200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "site_visits" (
        "id" smallint PRIMARY KEY DEFAULT 1,
        "total_count" integer NOT NULL DEFAULT 0,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_site_visits_singleton" CHECK ("id" = 1),
        CONSTRAINT "CHK_site_visits_total_count_non_negative" CHECK ("total_count" >= 0)
      )
    `);
    await queryRunner.query(`INSERT INTO "site_visits" ("id", "total_count") VALUES (1, 0)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "site_visits"');
  }
}
