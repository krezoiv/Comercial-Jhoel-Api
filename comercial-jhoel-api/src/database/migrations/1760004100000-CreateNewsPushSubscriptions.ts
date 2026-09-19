import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Web Push (VAPID) para Noticias — reemplaza el envío automático por
 * WhatsApp (removido en 693299a) sin duplicar nada del módulo de
 * suscriptores/preferencias/clasificación ya existente:
 *
 * - `news_subscribers.whatsapp_number` pasa a ser NULLABLE. Un suscriptor
 *   que solo activa notificaciones push (sin pasar por el formulario de
 *   WhatsApp) no tiene número — sigue siendo la MISMA tabla, el mismo
 *   `manage_token`, las MISMAS categorías vía `news_subscriber_types`.
 *   `UQ_news_subscribers_whatsapp_active` (índice único parcial) no se ve
 *   afectado: Postgres nunca considera dos NULL como duplicados bajo un
 *   índice único.
 *
 * - `news_push_subscriptions`: un dispositivo/navegador por fila — "1
 *   suscriptor = N dispositivos". `endpoint` es la clave natural de
 *   deduplicación (el mismo navegador reintentando la suscripción produce
 *   siempre el mismo endpoint), de ahí el índice único sobre esa columna
 *   — nunca sobre `subscriber_id` solo.
 *
 * - `news_push_deliveries`: cola/histórico de envíos por
 *   noticia+dispositivo (mismo patrón que la extinta `news_notifications`,
 *   pero apuntando a un dispositivo específico, no a un suscriptor —
 *   así un dispositivo inválido nunca afecta el registro de los demás).
 */
export class CreateNewsPushSubscriptions1760004100000 implements MigrationInterface {
  name = 'CreateNewsPushSubscriptions1760004100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news_subscribers" ALTER COLUMN "whatsapp_number" DROP NOT NULL`);

    await queryRunner.query(`
      CREATE TABLE "news_push_subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "subscriber_id" uuid NOT NULL REFERENCES "news_subscribers"("id") ON DELETE CASCADE,
        "endpoint" text NOT NULL,
        "p256dh" varchar(255) NOT NULL,
        "auth" varchar(255) NOT NULL,
        "user_agent" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "last_seen_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_news_push_subscriptions_endpoint" ON "news_push_subscriptions" ("endpoint")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_news_push_subscriptions_subscriber" ON "news_push_subscriptions" ("subscriber_id", "is_active")
    `);

    await queryRunner.query(`
      CREATE TABLE "news_push_deliveries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "news_article_id" uuid NOT NULL REFERENCES "news_articles"("id") ON DELETE RESTRICT,
        "push_subscription_id" uuid NOT NULL REFERENCES "news_push_subscriptions"("id") ON DELETE RESTRICT,
        "status" varchar(20) NOT NULL DEFAULT 'PENDING',
        "attempts" integer NOT NULL DEFAULT 0,
        "error_message" varchar(500),
        "sent_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_news_push_deliveries_article_subscription" UNIQUE ("news_article_id", "push_subscription_id"),
        CONSTRAINT "CHK_news_push_deliveries_status" CHECK ("status" IN ('PENDING', 'SENT', 'FAILED', 'EXPIRED'))
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_news_push_deliveries_status" ON "news_push_deliveries" ("status")`);
  }

  /**
   * Reversión parcial, a propósito: las dos tablas nuevas siempre se
   * pueden borrar limpio, pero volver a poner `whatsapp_number` como
   * NOT NULL fallaría en cuanto exista un solo suscriptor real registrado
   * solo por push (columna NULL genuina, no un dato corrupto) — mismo
   * criterio ya documentado en otras migraciones de este proyecto para
   * cambios estructurales que datos reales pueden llegar a depender de
   * ellos.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "news_push_deliveries"');
    await queryRunner.query('DROP TABLE IF EXISTS "news_push_subscriptions"');
  }
}
