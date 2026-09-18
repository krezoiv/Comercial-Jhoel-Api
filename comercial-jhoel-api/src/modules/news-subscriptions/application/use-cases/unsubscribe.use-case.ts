import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';

/** Soft — nunca borra físicamente la fila (punto 19/39 del pedido). Idempotente: desuscribirse dos veces con el mismo token no falla. */
@Injectable()
export class UnsubscribeUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
  ) {}

  async execute(token: string): Promise<void> {
    const subscriber = await this.newsSubscriberRepository.findByManageToken(token);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }
    if (!subscriber.isActive) {
      return;
    }
    await this.newsSubscriberRepository.setActive(subscriber.id, false);
    await this.newsSubscriberRepository.recordAudit({
      subscriberId: subscriber.id,
      action: 'UNSUBSCRIBED',
      previousTypeIds: subscriber.types.map((t) => t.id),
      newTypeIds: null,
      performedBy: null,
    });
  }
}
