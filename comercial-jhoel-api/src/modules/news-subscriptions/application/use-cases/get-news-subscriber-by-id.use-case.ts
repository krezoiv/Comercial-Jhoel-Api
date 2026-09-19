import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NEWS_PUSH_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/news-push-subscription.repository';
import type { NewsPushSubscriptionRepository } from '../../domain/repositories/news-push-subscription.repository';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';
import {
  NewsSubscriberDetailOutput,
  toNewsSubscriberAuditEntryOutput,
  toNewsSubscriberOutput,
} from '../dtos/news-subscriber-output';

/** Incluye el historial (punto 13 del pedido: "visualizar historial") y los dispositivos push registrados — número siempre enmascarado, igual que en el listado. */
@Injectable()
export class GetNewsSubscriberByIdUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
    @Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)
    private readonly newsPushSubscriptionRepository: NewsPushSubscriptionRepository,
  ) {}

  async execute(id: string): Promise<NewsSubscriberDetailOutput> {
    const subscriber = await this.newsSubscriberRepository.findById(id);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }
    const [auditLog, pushDevices] = await Promise.all([
      this.newsSubscriberRepository.findAuditLog(id),
      this.newsPushSubscriptionRepository.findBySubscriber(id),
    ]);
    return {
      ...toNewsSubscriberOutput(subscriber),
      auditLog: auditLog.map(toNewsSubscriberAuditEntryOutput),
      pushDevices,
    };
  }
}
