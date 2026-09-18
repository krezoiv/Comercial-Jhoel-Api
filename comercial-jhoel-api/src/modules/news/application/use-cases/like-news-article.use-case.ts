import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotVisibleError } from '../../domain/errors/news-article-not-visible.error';

/**
 * "Me gusta" público — solo sobre noticias activas. `delta` siempre
 * `+1`/`-1`, nunca un valor arbitrario del cliente; el piso de 0 y el
 * conteo real los garantiza siempre `adjustLikes` en el repositorio,
 * atómicamente.
 */
@Injectable()
export class LikeNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string, delta: 1 | -1): Promise<{ likesCount: number }> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article || !article.isActive) {
      throw new NewsArticleNotVisibleError();
    }
    const likesCount = await this.newsArticleRepository.adjustLikes(id, delta);
    return { likesCount };
  }
}
