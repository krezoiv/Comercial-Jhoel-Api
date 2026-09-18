import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';
import { AtLeastOneNewsTypeRequiredError } from '../../domain/errors/at-least-one-news-type-required.error';
import { SubscriptionOutput, toSubscriptionOutput } from '../dtos/news-subscriber-output';

/**
 * "Modificar preferencias" (punto 20 del pedido) — nunca "cancelar", solo
 * cambia el conjunto de categorías. El consentimiento ya dado se conserva
 * tal cual (no se pide de nuevo ni se resetea `consent_at`); el cambio
 * queda registrado en la bitácora igualmente.
 */
@Injectable()
export class UpdateSubscriptionPreferencesUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(token: string, typeIds: string[]): Promise<SubscriptionOutput> {
    const subscriber = await this.newsSubscriberRepository.findByManageToken(token);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }

    const uniqueTypeIds = [...new Set(typeIds)];
    if (uniqueTypeIds.length === 0) {
      throw new AtLeastOneNewsTypeRequiredError();
    }
    for (const typeId of uniqueTypeIds) {
      const type = await this.newsTypeRepository.findById(typeId);
      if (!type || !type.isActive) {
        throw new InvalidNewsTypeError();
      }
    }

    await this.newsSubscriberRepository.replaceTypes(subscriber.id, uniqueTypeIds);
    await this.newsSubscriberRepository.recordAudit({
      subscriberId: subscriber.id,
      action: 'PREFERENCES_UPDATED',
      previousTypeIds: subscriber.types.map((t) => t.id),
      newTypeIds: uniqueTypeIds,
      performedBy: null,
    });

    const updated = await this.newsSubscriberRepository.findByManageToken(token);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return toSubscriptionOutput(updated!);
  }
}
