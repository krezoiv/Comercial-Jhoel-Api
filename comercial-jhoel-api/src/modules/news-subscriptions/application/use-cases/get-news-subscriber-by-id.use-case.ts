import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';
import {
  NewsSubscriberAuditEntryOutput,
  NewsSubscriberOutput,
  toNewsSubscriberAuditEntryOutput,
  toNewsSubscriberOutput,
} from '../dtos/news-subscriber-output';

export interface NewsSubscriberDetailOutput extends NewsSubscriberOutput {
  auditLog: NewsSubscriberAuditEntryOutput[];
}

/** Incluye el historial (punto 13 del pedido: "visualizar historial") — número siempre enmascarado, igual que en el listado. */
@Injectable()
export class GetNewsSubscriberByIdUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
  ) {}

  async execute(id: string): Promise<NewsSubscriberDetailOutput> {
    const subscriber = await this.newsSubscriberRepository.findById(id);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }
    const auditLog = await this.newsSubscriberRepository.findAuditLog(id);
    return {
      ...toNewsSubscriberOutput(subscriber),
      auditLog: auditLog.map(toNewsSubscriberAuditEntryOutput),
    };
  }
}
