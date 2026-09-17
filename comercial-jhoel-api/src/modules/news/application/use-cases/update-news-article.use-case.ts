import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

export interface UpdateNewsArticleInput {
  title?: string;
  description?: string;
  publishedAt?: string;
  userId: string;
}

@Injectable()
export class UpdateNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string, input: UpdateNewsArticleInput): Promise<NewsArticleOutput> {
    const existing = await this.newsArticleRepository.findById(id);
    if (!existing) {
      throw new NewsArticleNotFoundError(id);
    }

    const updated = await this.newsArticleRepository.update(id, {
      title: input.title?.trim(),
      description: input.description?.trim(),
      publishedAt: input.publishedAt,
      updatedBy: input.userId,
    });
    return toNewsArticleOutput(updated);
  }
}
