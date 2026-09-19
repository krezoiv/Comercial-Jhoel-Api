import { Inject, Injectable } from '@nestjs/common';
import { NEWS_PUSH_SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/news-push-subscription.repository';
import type { NewsPushSubscriptionRepository } from '../../domain/repositories/news-push-subscription.repository';

/**
 * Desactiva un único dispositivo por su `endpoint` — el mismo criterio de
 * "credencial opaca" que ya usa `manageToken` (una URL de push generada
 * por el navegador es, en la práctica, imposible de adivinar). Nunca
 * toca otros dispositivos del mismo suscriptor (punto explícito del
 * pedido) ni el propio suscriptor/sus preferencias — solo ese endpoint.
 */
@Injectable()
export class UnregisterPushSubscriptionUseCase {
  constructor(
    @Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)
    private readonly newsPushSubscriptionRepository: NewsPushSubscriptionRepository,
  ) {}

  async execute(endpoint: string): Promise<void> {
    await this.newsPushSubscriptionRepository.deactivateByEndpoint(endpoint);
  }
}
