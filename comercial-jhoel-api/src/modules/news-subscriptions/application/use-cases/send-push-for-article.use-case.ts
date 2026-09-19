import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NEWS_PUSH_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/news-push-subscription.repository';
import type { NewsPushSubscriptionRepository } from '../../domain/repositories/news-push-subscription.repository';
import { PUSH_SENDER } from '../ports/push-sender.port';
import type { PushSender } from '../ports/push-sender.port';
import { buildNewsPushPayload } from '../utils/build-news-push-payload';

export interface SendPushForArticleInput {
  articleId: string;
  slug: string;
  title: string;
  excerpt: string;
  newsTypeId: string;
}

/**
 * Determina destinatarios (por DISPOSITIVO, no por suscriptor — ver
 * `findEligibleForArticle`), arma el payload una sola vez con datos reales
 * de la noticia, y envía en paralelo a cada dispositivo elegible
 * (`Promise.allSettled` — un fallo nunca bloquea a los demás). Un
 * endpoint que el navegador confirma muerto (410/404) se marca inactivo
 * de inmediato: los demás dispositivos del mismo suscriptor siguen
 * funcionando sin cambios (punto explícito del pedido).
 *
 * Reemplaza, para el canal push, lo que
 * `CreateNewsNotificationsForArticleUseCase`+`SendPendingNewsNotificationsUseCase`
 * hacían para WhatsApp (ambos removidos en 693299a) — mismo criterio de
 * "nunca bloquear ni poder tumbar la publicación de la noticia", ahora en
 * un solo use case.
 */
@Injectable()
export class SendPushForArticleUseCase {
  private readonly logger = new Logger(SendPushForArticleUseCase.name);

  constructor(
    @Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)
    private readonly newsPushSubscriptionRepository: NewsPushSubscriptionRepository,
    @Inject(PUSH_SENDER)
    private readonly pushSender: PushSender,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: SendPushForArticleInput): Promise<{ sent: number; failed: number }> {
    const eligible = await this.newsPushSubscriptionRepository.findEligibleForArticle(input.newsTypeId);
    if (eligible.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const frontendUrl = (this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:4200').replace(/\/$/, '');
    const payload = buildNewsPushPayload({
      title: input.title,
      excerpt: input.excerpt,
      url: `${frontendUrl}/noticias/${input.slug}`,
      iconUrl: `${frontendUrl}/assets/images/logo.png`,
    });

    const results = await Promise.allSettled(
      eligible.map(async (subscription) => {
        const isNew = await this.newsPushSubscriptionRepository.createDelivery(input.articleId, subscription.id);
        if (!isNew) {
          // Ya existe una entrega para este par noticia+dispositivo (mismo
          // `UNIQUE` que ya usaba `news_notifications`) — nunca un segundo
          // envío al mismo dispositivo para la misma noticia.
          return false;
        }

        const outcome = await this.pushSender.send(
          { endpoint: subscription.endpoint, p256dh: subscription.p256dh, auth: subscription.auth },
          payload,
        );

        if (outcome.result === 'sent') {
          await this.newsPushSubscriptionRepository.markDeliverySent(input.articleId, subscription.id);
          return true;
        }
        if (outcome.result === 'expired') {
          await this.newsPushSubscriptionRepository.markDeliveryExpired(input.articleId, subscription.id, outcome.errorMessage);
          await this.newsPushSubscriptionRepository.deactivateByEndpoint(subscription.endpoint);
          return false;
        }
        await this.newsPushSubscriptionRepository.markDeliveryFailed(input.articleId, subscription.id, outcome.errorMessage);
        return false;
      }),
    );

    let sent = 0;
    let failed = 0;
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        sent += 1;
      } else {
        failed += 1;
      }
    }

    if (failed > 0) {
      this.logger.warn(`Push de noticia ${input.articleId}: ${sent} enviados, ${failed} fallidos/expirados/duplicados.`);
    }

    return { sent, failed };
  }
}
