import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

export interface UpdateNewsArticleInput {
  title?: string;
  description?: string;
  publishedAt?: string;
  newsTypeId?: string;
  userId: string;
}

/**
 * Editar — incluido cambiar la clasificación — NUNCA dispara notificaciones
 * (punto 11/28 del pedido). El slug tampoco se toca aquí: es estable desde
 * que se creó la noticia.
 */
@Injectable()
export class UpdateNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(id: string, input: UpdateNewsArticleInput): Promise<NewsArticleOutput> {
    const existing = await this.newsArticleRepository.findById(id);
    if (!existing) {
      throw new NewsArticleNotFoundError(id);
    }

    if (input.newsTypeId !== undefined) {
      const newsType = await this.newsTypeRepository.findById(input.newsTypeId);
      if (!newsType || !newsType.isActive) {
        throw new InvalidNewsTypeError();
      }
    }

    const updated = await this.newsArticleRepository.update(id, {
      title: input.title?.trim(),
      description: input.description?.trim(),
      publishedAt: input.publishedAt,
      newsTypeId: input.newsTypeId,
      updatedBy: input.userId,
    });
    return toNewsArticleOutput(updated);
  }
}
