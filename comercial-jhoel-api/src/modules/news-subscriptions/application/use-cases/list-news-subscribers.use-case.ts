import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberOutput, toNewsSubscriberOutput } from '../dtos/news-subscriber-output';

@Injectable()
export class ListNewsSubscribersUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
  ) {}

  async execute(includeInactive = true): Promise<NewsSubscriberOutput[]> {
    const items = await this.newsSubscriberRepository.findAll({ activeOnly: !includeInactive });
    return items.map(toNewsSubscriberOutput);
  }
}
