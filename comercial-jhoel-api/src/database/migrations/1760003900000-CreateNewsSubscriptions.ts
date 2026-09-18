import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Suscripción de clientes a noticias por WhatsApp — cuatro tablas nuevas:
 *
 * - `news_subscribers`: un registro por número de WhatsApp. Sin
 *   `created_by`/`updated_by` (dato enviado por un visitante público sin
 *   sesión, igual que `catalog_requests`/`catalog_product_requests`).
 *   `manage_token` es el mecanismo de "cancelar/editar preferencias" sin
 *   usar el número como autenticación (punto 19 del pedido) — mucho más
 *   difícil de adivinar.
 * - `news_subscriber_types`: relación M:N normalizada suscriptor↔tipo
 *   (nunca texto separado por comas) — PK compuesta, mismo idioma
 *   `INSERT...ON CONFLICT DO NOTHING` que `catalog_likes`.
 * - `news_subscriber_audit_log`: línea de tiempo de consentimiento/
 *   cambios de preferencias/cancelación — mismo patrón que
 *   `day_audit_logs` (evento + estado anterior/nuevo), no columnas
 *   `created_by`/`updated_by` sueltas, porque lo que hace falta aquí es un
 *   historial, no solo "quién tocó la fila por última vez". Los arrays de
 *   tipos "anterior"/"nuevo" son `UUID[]` — nunca una lista de texto.
 * - `news_notifications`: la cola de notificaciones, preparada para un
 *   futuro proveedor real de WhatsApp. `UNIQUE(news_article_id,
 *   subscriber_id)` es la garantía estructural de "una sola notificación
 *   por par noticia+suscriptor" (punto 15/26 del pedido) — nunca una
 *   consulta `DISTINCT` en la aplicación.
 */
export class CreateNewsSubscriptions1760003900000 implements MigrationInterface {
  name = 'CreateNewsSubscriptions1760003900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "news_subscribers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "whatsapp_number" varchar(20) NOT NULL,
        "name" varchar(150),
        "is_active" boolean NOT NULL DEFAULT true,
        "consent_given" boolean NOT NULL DEFAULT false,
        "consent_at" timestamptz,
        "manage_token" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_subscribers_whatsapp_active"
      ON "news_subscribers" ("whatsapp_number")
      WHERE "is_active" = true
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_subscribers_manage_token" ON "news_subscribers" ("manage_token")
    `);

    await queryRunner.query(`
      CREATE TABLE "news_subscriber_types" (
        "subscriber_id" uuid NOT NULL REFERENCES "news_subscribers"("id") ON DELETE CASCADE,
        "news_type_id" uuid NOT NULL REFERENCES "news_types"("id") ON DELETE RESTRICT,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_news_subscriber_types" PRIMARY KEY ("subscriber_id", "news_type_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "news_subscriber_audit_log" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "subscriber_id" uuid NOT NULL REFERENCES "news_subscribers"("id") ON DELETE CASCADE,
        "action" varchar(30) NOT NULL,
        "previous_type_ids" uuid[],
        "new_type_ids" uuid[],
        "performed_by" uuid REFERENCES "users"("id") ON DELETE RESTRICT,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_news_subscriber_audit_log_subscriber" ON "news_subscriber_audit_log" ("subscriber_id", "created_at" DESC)
    `);

    await queryRunner.query(`
      CREATE TABLE "news_notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "news_article_id" uuid NOT NULL REFERENCES "news_articles"("id") ON DELETE RESTRICT,
        "subscriber_id" uuid NOT NULL REFERENCES "news_subscribers"("id") ON DELETE RESTRICT,
        "news_type_id" uuid NOT NULL REFERENCES "news_types"("id") ON DELETE RESTRICT,
        "message_preview" text NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'PENDING',
        "attempts" integer NOT NULL DEFAULT 0,
        "external_id" varchar(100),
        "error_message" varchar(500),
        "sent_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_news_notifications_article_subscriber" UNIQUE ("news_article_id", "subscriber_id"),
        CONSTRAINT "CHK_news_notifications_status" CHECK ("status" IN ('PENDING', 'SENT', 'FAILED'))
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_news_notifications_status" ON "news_notifications" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "news_notifications"');
    await queryRunner.query('DROP TABLE IF EXISTS "news_subscriber_audit_log"');
    await queryRunner.query('DROP TABLE IF EXISTS "news_subscriber_types"');
    await queryRunner.query('DROP TABLE IF EXISTS "news_subscribers"');
  }
}
