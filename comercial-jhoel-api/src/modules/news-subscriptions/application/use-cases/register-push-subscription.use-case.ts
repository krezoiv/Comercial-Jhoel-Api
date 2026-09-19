import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NEWS_PUSH_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/news-push-subscription.repository';
import type { NewsPushSubscriptionRepository } from '../../domain/repositories/news-push-subscription.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { AtLeastOneNewsTypeRequiredError } from '../../domain/errors/at-least-one-news-type-required.error';
import { SubscriptionOutput, toSubscriptionOutput } from '../dtos/news-subscriber-output';

export interface RegisterPushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string | null;
  typeIds: string[];
  /**
   * `manageToken` de una suscripción existente en ESTE MISMO navegador
   * (ej. ya se suscribió por WhatsApp antes) — si se resuelve a un
   * suscriptor real, el dispositivo se vincula a ESE perfil (mismas
   * categorías/consentimiento) en vez de crear uno nuevo. Sin él (el caso
   * normal: "Activar notificaciones" sin haber usado el formulario de
   * WhatsApp), se crea un suscriptor nuevo, solo-push
   * (`whatsappNumber: null`).
   */
  existingManageToken?: string;
}

/**
 * Alta/actualización de un dispositivo de Web Push. Reutiliza
 * COMPLETAMENTE el módulo de suscriptores existente — nunca un
 * "suscriptor push" paralelo: mismo `NewsSubscriber`
 * (`whatsappNumber: null` cuando no hay número), mismas categorías vía
 * `news_subscriber_types`, mismo `manageToken` de autoservicio. Lo único
 * genuinamente nuevo es la fila en `news_push_subscriptions` (el
 * dispositivo en sí) — ver `NewsPushSubscriptionRepository.upsertByEndpoint`
 * para por qué reintentar desde el mismo navegador nunca duplica.
 */
@Injectable()
export class RegisterPushSubscriptionUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
    @Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)
    private readonly newsPushSubscriptionRepository: NewsPushSubscriptionRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(input: RegisterPushSubscriptionInput): Promise<SubscriptionOutput> {
    const typeIds = [...new Set(input.typeIds)];
    if (typeIds.length === 0) {
      throw new AtLeastOneNewsTypeRequiredError();
    }
    for (const typeId of typeIds) {
      const type = await this.newsTypeRepository.findById(typeId);
      if (!type || !type.isActive) {
        throw new InvalidNewsTypeError();
      }
    }

    const now = new Date();
    const existing = input.existingManageToken
      ? await this.newsSubscriberRepository.findByManageToken(input.existingManageToken)
      : null;

    const subscriber = existing
      ? await this.linkToExisting(existing.id, typeIds, now)
      : await this.createNew(typeIds, now);

    await this.newsPushSubscriptionRepository.upsertByEndpoint({
      subscriberId: subscriber.id,
      endpoint: input.endpoint,
      p256dh: input.p256dh,
      auth: input.auth,
      userAgent: input.userAgent,
    });

    return toSubscriptionOutput(subscriber);
  }

  private async linkToExisting(subscriberId: string, typeIds: string[], now: Date) {
    await this.newsSubscriberRepository.replaceTypes(subscriberId, typeIds);
    await this.newsSubscriberRepository.setConsent(subscriberId, now);
    await this.newsSubscriberRepository.setActive(subscriberId, true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.newsSubscriberRepository.findById(subscriberId))!;
  }

  private async createNew(typeIds: string[], now: Date) {
    const created = await this.newsSubscriberRepository.createWithTypes({
      whatsappNumber: null,
      name: null,
      consentAt: now,
      typeIds,
    });
    await this.newsSubscriberRepository.recordAudit({
      subscriberId: created.id,
      action: 'SUBSCRIBED',
      previousTypeIds: null,
      newTypeIds: typeIds,
      performedBy: null,
    });
    return created;
  }
}
