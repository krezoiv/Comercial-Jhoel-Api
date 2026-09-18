import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NEWS_NOTIFICATION_REPOSITORY } from '../../domain/repositories/news-notification.repository';
import type { NewsNotificationRepository } from '../../domain/repositories/news-notification.repository';
import { buildNewsWhatsappMessage } from '../utils/build-news-whatsapp-message';

export interface CreateNewsNotificationsForArticleInput {
  articleId: string;
  slug: string;
  title: string;
  excerpt: string;
  newsTypeId: string;
  newsTypeName: string;
}

/**
 * Se llama UNA sola vez, al final de `CreateNewsArticleUseCase` — nunca
 * desde el use case de edición (ver el punto 11/28 del pedido: editar o
 * cambiar la clasificación de una noticia ya publicada nunca debe generar
 * un nuevo envío). La determinación real de destinatarios vive
 * exclusivamente en `NewsNotificationRepository.createForArticle` (un solo
 * `INSERT...SELECT...ON CONFLICT DO NOTHING`) — esta clase solo arma la URL
 * y el mensaje con datos reales y delega.
 */
@Injectable()
export class CreateNewsNotificationsForArticleUseCase {
  constructor(
    @Inject(NEWS_NOTIFICATION_REPOSITORY)
    private readonly newsNotificationRepository: NewsNotificationRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: CreateNewsNotificationsForArticleInput): Promise<{ created: number }> {
    const frontendUrl = this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:4200';
    const url = `${frontendUrl.replace(/\/$/, '')}/noticias/${input.slug}`;

    const message = buildNewsWhatsappMessage({
      title: input.title,
      excerpt: input.excerpt,
      typeName: input.newsTypeName,
      url,
    });

    return this.newsNotificationRepository.createForArticle({
      newsArticleId: input.articleId,
      newsTypeId: input.newsTypeId,
      messagePreview: message,
    });
  }
}
