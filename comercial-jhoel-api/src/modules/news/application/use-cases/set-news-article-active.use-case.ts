import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';

/** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — nunca se elimina físicamente una noticia ya publicada. */
@Injectable()
export class SetNewsArticleActiveUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string, isActive: boolean, userId: string): Promise<void> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article) {
      throw new NewsArticleNotFoundError(id);
    }
    await this.newsArticleRepository.setActive(id, isActive, userId);
  }
}
