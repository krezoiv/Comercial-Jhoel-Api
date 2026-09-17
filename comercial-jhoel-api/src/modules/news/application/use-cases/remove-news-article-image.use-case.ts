import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleNotFoundError } from '../../domain/errors/news-article-not-found.error';

@Injectable()
export class RemoveNewsArticleImageUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const article = await this.newsArticleRepository.findById(id);
    if (!article) {
      throw new NewsArticleNotFoundError(id);
    }
    await this.newsArticleRepository.removeImage(id, userId);
  }
}
