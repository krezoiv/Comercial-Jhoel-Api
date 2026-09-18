import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';
import { SubscriptionOutput, toSubscriptionOutput } from '../dtos/news-subscriber-output';

@Injectable()
export class GetSubscriptionByTokenUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
  ) {}

  async execute(token: string): Promise<SubscriptionOutput> {
    const subscriber = await this.newsSubscriberRepository.findByManageToken(token);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }
    return toSubscriptionOutput(subscriber);
  }
}
