import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

export interface CreateNewsArticleInput {
  title: string;
  description: string;
  publishedAt: string;
  userId: string;
}

@Injectable()
export class CreateNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
  ) {}

  async execute(input: CreateNewsArticleInput): Promise<NewsArticleOutput> {
    const article = await this.newsArticleRepository.create({
      title: input.title.trim(),
      description: input.description.trim(),
      publishedAt: input.publishedAt,
      createdBy: input.userId,
    });
    return toNewsArticleOutput(article);
  }
}
