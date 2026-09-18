import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type {
  CatalogLikeAction,
  CatalogLikeRepository,
} from '../../../likes/domain/repositories/catalog-like.repository';

/**
 * "Me gusta" público — solo sobre noticias activas. El conteo real y el
 * anti-duplicado por visitante viven en `catalog_likes` (ver
 * `CatalogLikeRepository`), nunca en un contador confiado del frontend.
 * `LIKE` exige que la noticia esté activa; `UNLIKE` no — un visitante
 * siempre puede deshacer su propio like aunque la noticia ya no esté
 * activa, y los likes históricos nunca se borran al desactivarla.
 */
@Injectable()
export class LikeNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(
    id: string,
    visitorId: string,
    action: CatalogLikeAction,
  ): Promise<{ likesCount: number; liked: boolean }> {
    if (action === 'LIKE') {
      const article = await this.newsArticleRepository.findById(id);
      if (!article || !article.isActive) {
        throw new NewsArticleNotVisibleError();
      }
      await this.catalogLikeRepository.like('NEWS', id, visitorId);
    } else {
      await this.catalogLikeRepository.unlike('NEWS', id, visitorId);
    }
    const likesCount = await this.catalogLikeRepository.getCount('NEWS', id);
    return { likesCount, liked: action === 'LIKE' };
  }
}
