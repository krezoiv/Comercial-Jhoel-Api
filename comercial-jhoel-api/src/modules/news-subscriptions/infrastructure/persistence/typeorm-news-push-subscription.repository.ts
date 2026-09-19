import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EligiblePushSubscription,
  NewsPushSubscriptionRepository,
  PushSubscriptionSummary,
  UpsertPushSubscriptionData,
} from '../../domain/repositories/news-push-subscription.repository';
import { NewsPushSubscriptionOrmEntity } from './news-push-subscription.orm-entity';

@Injectable()
export class TypeOrmNewsPushSubscriptionRepository implements NewsPushSubscriptionRepository {
  constructor(
    @InjectRepository(NewsPushSubscriptionOrmEntity)
    private readonly repository: Repository<NewsPushSubscriptionOrmEntity>,
  ) {}

  /**
   * `ON CONFLICT (endpoint) DO UPDATE` — el mismo navegador reintentando
   * la suscripción (ej. tras revocar y volver a conceder permiso)
   * reescribe la fila existente (incluida `subscriber_id`, por si ahora
   * se está vinculando a un `manageToken` distinto) en vez de crear una
   * segunda. `is_active` siempre vuelve a `true` aquí — es literalmente
   * un registro/re-registro.
   */
  async upsertByEndpoint(data: UpsertPushSubscriptionData): Promise<void> {
    await this.repository.manager.query(
      `INSERT INTO news_push_subscriptions (subscriber_id, endpoint, p256dh, auth, user_agent, is_active, last_seen_at)
       VALUES ($1, $2, $3, $4, $5, true, now())
       ON CONFLICT (endpoint) DO UPDATE SET
         subscriber_id = EXCLUDED.subscriber_id,
         p256dh = EXCLUDED.p256dh,
         auth = EXCLUDED.auth,
         user_agent = EXCLUDED.user_agent,
         is_active = true,
         last_seen_at = now(),
         updated_at = now()`,
      [data.subscriberId, data.endpoint, data.p256dh, data.auth, data.userAgent],
    );
  }

  async deactivateByEndpoint(endpoint: string): Promise<void> {
    await this.repository.update({ endpoint }, { isActive: false });
  }

  async findBySubscriber(subscriberId: string): Promise<PushSubscriptionSummary[]> {
    const orms = await this.repository.find({
      where: { subscriberId },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => ({
      id: orm.id,
      userAgent: orm.userAgent,
      isActive: orm.isActive,
      lastSeenAt: orm.lastSeenAt,
      createdAt: orm.createdAt,
    }));
  }

  /**
   * Mismo criterio wildcard/categoría que ya usaba `createForArticle` de
   * la extinta `news_notifications` — `nt.is_wildcard = true` (nunca
   * comparado contra el nombre/slug) es "Comercial recibe todo". Ahora
   * resuelto por DISPOSITIVO (`news_push_subscriptions`), no por
   * suscriptor: un suscriptor con 3 dispositivos activos produce 3 filas.
   */
  async findEligibleForArticle(newsTypeId: string): Promise<EligiblePushSubscription[]> {
    const rows: { id: string; endpoint: string; p256dh: string; auth: string }[] = await this.repository.manager.query(
      `SELECT ps.id, ps.endpoint, ps.p256dh, ps.auth
       FROM news_push_subscriptions ps
       JOIN news_subscribers s ON s.id = ps.subscriber_id
       WHERE ps.is_active = true AND s.is_active = true AND s.consent_given = true
         AND EXISTS (
           SELECT 1 FROM news_subscriber_types nst
           JOIN news_types nt ON nt.id = nst.news_type_id
           WHERE nst.subscriber_id = s.id AND (nt.is_wildcard = true OR nst.news_type_id = $1)
         )`,
      [newsTypeId],
    );
    return rows;
  }

  /**
   * `RETURNING id`, no un conteo de filas afectadas — `manager.query()`
   * en esta configuración devuelve solo el array de filas (confirmado
   * directamente, no asumido), nunca una tupla `[rows, affectedCount]`.
   * Con `RETURNING`, una fila que chocó contra `ON CONFLICT DO NOTHING`
   * simplemente no aparece en el array — `rows.length > 0` es la única
   * señal confiable de "sí se insertó" bajo este driver.
   */
  async createDelivery(newsArticleId: string, pushSubscriptionId: string): Promise<boolean> {
    const rows: { id: string }[] = await this.repository.manager.query(
      `INSERT INTO news_push_deliveries (news_article_id, push_subscription_id, status)
       VALUES ($1, $2, 'PENDING')
       ON CONFLICT (news_article_id, push_subscription_id) DO NOTHING
       RETURNING id`,
      [newsArticleId, pushSubscriptionId],
    );
    return rows.length > 0;
  }

  async markDeliverySent(newsArticleId: string, pushSubscriptionId: string): Promise<void> {
    await this.repository.manager.query(
      `UPDATE news_push_deliveries SET status = 'SENT', sent_at = now(), attempts = attempts + 1
       WHERE news_article_id = $1 AND push_subscription_id = $2`,
      [newsArticleId, pushSubscriptionId],
    );
  }

  async markDeliveryFailed(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void> {
    await this.repository.manager.query(
      `UPDATE news_push_deliveries SET status = 'FAILED', error_message = $3, attempts = attempts + 1
       WHERE news_article_id = $1 AND push_subscription_id = $2`,
      [newsArticleId, pushSubscriptionId, errorMessage.slice(0, 500)],
    );
  }

  async markDeliveryExpired(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void> {
    await this.repository.manager.query(
      `UPDATE news_push_deliveries SET status = 'EXPIRED', error_message = $3, attempts = attempts + 1
       WHERE news_article_id = $1 AND push_subscription_id = $2`,
      [newsArticleId, pushSubscriptionId, errorMessage.slice(0, 500)],
    );
  }
}
