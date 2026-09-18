import { Inject, Injectable } from '@nestjs/common';
import { NEWS_SUBSCRIBER_REPOSITORY } from '../../domain/repositories/news-subscriber.repository';
import type { NewsSubscriberRepository } from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberNotFoundError } from '../../domain/errors/news-subscriber-not-found.error';

/** Activar/desactivar desde el admin (punto 13 del pedido) — soft, nunca borra la fila; queda registrado en la bitácora con `performedBy`. */
@Injectable()
export class SetNewsSubscriberActiveUseCase {
  constructor(
    @Inject(NEWS_SUBSCRIBER_REPOSITORY)
    private readonly newsSubscriberRepository: NewsSubscriberRepository,
  ) {}

  async execute(id: string, isActive: boolean, performedBy: string): Promise<void> {
    const subscriber = await this.newsSubscriberRepository.findById(id);
    if (!subscriber) {
      throw new NewsSubscriberNotFoundError();
    }
    await this.newsSubscriberRepository.setActive(id, isActive);
    await this.newsSubscriberRepository.recordAudit({
      subscriberId: id,
      action: isActive ? 'ADMIN_ACTIVATED' : 'ADMIN_DEACTIVATED',
      previousTypeIds: null,
      newTypeIds: null,
      performedBy,
    });
  }
}
