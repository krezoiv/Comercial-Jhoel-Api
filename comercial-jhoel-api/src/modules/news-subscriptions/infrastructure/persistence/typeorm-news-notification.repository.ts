import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateNewsNotificationsForArticleData,
  NewsNotificationRepository,
} from '../../domain/repositories/news-notification.repository';
import { NewsNotificationOrmEntity } from './news-notification.orm-entity';

@Injectable()
export class TypeOrmNewsNotificationRepository implements NewsNotificationRepository {
  constructor(
    @InjectRepository(NewsNotificationOrmEntity)
    private readonly repository: Repository<NewsNotificationOrmEntity>,
  ) {}

  /**
   * Única fuente de verdad de "quién debe recibir esta noticia" — un solo
   * `INSERT ... SELECT ... ON CONFLICT DO NOTHING`, atómico como una sola
   * sentencia (no hace falta una función almacenada, mismo razonamiento ya
   * documentado para `confirm_open_sale`/`voidOperation`: no forzar un SP
   * donde una sentencia plana ya es correcta).
   *
   * `nt.is_wildcard = true` es el mecanismo central de "Comercial recibe
   * todas las noticias" — nunca se compara contra el nombre/slug
   * 'comercial' como string, así que una categoría futura marcada wildcard
   * (si algún día se decidiera) funcionaría igual sin tocar esta consulta.
   * `UNIQUE(news_article_id, subscriber_id)` es lo que garantiza
   * estructuralmente que nunca haya dos notificaciones para el mismo par.
   */
  async createForArticle(data: CreateNewsNotificationsForArticleData): Promise<{ created: number }> {
    const result: [unknown[], number] = await this.repository.manager.query(
      `INSERT INTO news_notifications (news_article_id, subscriber_id, news_type_id, message_preview, status)
       SELECT $1, s.id, $2, $3, 'PENDING'
       FROM news_subscribers s
       WHERE s.is_active = true AND s.consent_given = true
         AND EXISTS (
           SELECT 1 FROM news_subscriber_types nst
           JOIN news_types nt ON nt.id = nst.news_type_id
           WHERE nst.subscriber_id = s.id AND (nt.is_wildcard = true OR nst.news_type_id = $2)
         )
       ON CONFLICT (news_article_id, subscriber_id) DO NOTHING`,
      [data.newsArticleId, data.newsTypeId, data.messagePreview],
    );
    // `manager.query()` para un INSERT devuelve `[rows, affectedCount]` en este driver — mismo patrón ya documentado en `adjustLikes`.
    const affected = result[1];
    return { created: typeof affected === 'number' ? affected : 0 };
  }
}
