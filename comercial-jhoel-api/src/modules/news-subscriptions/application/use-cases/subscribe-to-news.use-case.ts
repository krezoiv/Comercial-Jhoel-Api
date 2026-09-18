import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { ConsentRequiredError } from '../../domain/errors/consent-required.error';
import { AtLeastOneNewsTypeRequiredError } from '../../domain/errors/at-least-one-news-type-required.error';
import { normalizeWhatsappNumber } from '../utils/normalize-whatsapp-number';
import { SubscriptionOutput, toSubscriptionOutput } from '../dtos/news-subscriber-output';

export interface SubscribeToNewsInput {
  whatsappNumber: string;
  name?: string;
  typeIds: string[];
  consent: boolean;
}

/**
 * Alta pública de suscripción. Si el número ya tiene una suscripción
 * activa, se trata como una actualización de sus preferencias (reemplaza
 * sus categorías, reconfirma el consentimiento) en vez de rechazar con un
 * duplicado — un visitante real reenviando el formulario está cambiando de
 * opinión, no cometiendo un error. Nunca se registra nada sin
 * `consent === true` (punto 5 del pedido).
 */
@Injectable()
export class SubscribeToNewsUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(input: SubscribeToNewsInput): Promise<SubscriptionOutput> {
    if (!input.consent) {
      throw new ConsentRequiredError();
    }
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

    const whatsappNumber = normalizeWhatsappNumber(input.whatsappNumber);
    const name = input.name?.trim() || null;
    const now = new Date();

    const existing = await this.newsSubscriberRepository.findActiveByWhatsapp(whatsappNumber);
    if (existing) {
      await this.newsSubscriberRepository.replaceTypes(existing.id, typeIds);
      await this.newsSubscriberRepository.setConsent(existing.id, now);
      await this.newsSubscriberRepository.recordAudit({
        subscriberId: existing.id,
        action: 'PREFERENCES_UPDATED',
        previousTypeIds: existing.types.map((t) => t.id),
        newTypeIds: typeIds,
        performedBy: null,
      });
      const updated = await this.newsSubscriberRepository.findById(existing.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return toSubscriptionOutput(updated!);
    }

    const created = await this.newsSubscriberRepository.createWithTypes({
      whatsappNumber,
      name,
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
    return toSubscriptionOutput(created);
  }
}
