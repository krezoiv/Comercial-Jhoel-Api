import { Inject, Injectable, Logger } from '@nestjs/common';
import { NEWS_NOTIFICATION_REPOSITORY } from '../../domain/repositories/news-notification.repository';
import type { NewsNotificationRepository } from '../../domain/repositories/news-notification.repository';
import { WHATSAPP_SENDER } from '../ports/whatsapp-sender.port';
import type { WhatsAppSender } from '../ports/whatsapp-sender.port';

/**
 * Procesa la cola de `news_notifications` en `PENDING` — se llama justo
 * después de `CreateNewsNotificationsForArticleUseCase` (acotado a la
 * noticia recién creada) desde `CreateNewsArticleUseCase`, pero también
 * sirve sin `articleId` para un reintento manual de todo lo pendiente
 * (por ejemplo, si el proveedor estuvo caído).
 *
 * Nunca lanza — cada envío es independiente (`Promise.allSettled`), así
 * que un fallo de red o de un número en particular nunca bloquea ni
 * revierte la creación de la noticia ni el resto de los envíos. El
 * llamador (`CreateNewsArticleUseCase`) además ya envuelve esta llamada en
 * su propio `try/catch` — ver el comentario ahí.
 */
@Injectable()
export class SendPendingNewsNotificationsUseCase {
  private readonly logger = new Logger(SendPendingNewsNotificationsUseCase.name);

  constructor(
    @Inject(NEWS_NOTIFICATION_REPOSITORY)
    private readonly newsNotificationRepository: NewsNotificationRepository,
    @Inject(WHATSAPP_SENDER)
    private readonly whatsappSender: WhatsAppSender,
  ) {}

  async execute(articleId?: string): Promise<{ sent: number; failed: number }> {
    const pending = await this.newsNotificationRepository.findPendingWithRecipient(articleId);
    if (pending.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      pending.map(async (notification) => {
        const result = await this.whatsappSender.sendTemplateMessage(notification.whatsappNumber, notification.messagePreview);
        if (result.success) {
          await this.newsNotificationRepository.markSent(notification.id, result.externalId);
        } else {
          await this.newsNotificationRepository.markFailed(
            notification.id,
            result.errorMessage ?? 'Fallo desconocido al enviar por WhatsApp.',
          );
        }
        return result.success;
      }),
    );

    let sent = 0;
    let failed = 0;
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        sent += 1;
      } else {
        failed += 1;
      }
    }

    if (failed > 0) {
      this.logger.warn(`Cola de notificaciones: ${sent} enviadas, ${failed} fallidas.`);
    }

    return { sent, failed };
  }
}
