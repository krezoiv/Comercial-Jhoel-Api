import { Inject, Injectable } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { CreateNewsNotificationsForArticleUseCase } from '../../../news-subscriptions/application/use-cases/create-news-notifications-for-article.use-case';
import { generateNewsArticleSlug } from '../utils/generate-news-article-slug';
import { NewsArticleOutput, toNewsArticleOutput } from '../dtos/news-article-output';

const EXCERPT_LENGTH = 160;

export interface CreateNewsArticleInput {
  title: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
  userId: string;
}

/**
 * Único punto donde se dispara el fan-out de notificaciones (punto 11/28
 * del pedido: "solo NUEVA NOTICIA + PUBLICAR genera el proceso") — este
 * módulo no tiene hoy un paso de "publicar" separado de "crear" (a
 * diferencia de Teléfonos), así que crear una noticia ES publicarla.
 * `UpdateNewsArticleUseCase` nunca llama a
 * `CreateNewsNotificationsForArticleUseCase`.
 */
@Injectable()
export class CreateNewsArticleUseCase {
  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
    private readonly createNewsNotificationsForArticleUseCase: CreateNewsNotificationsForArticleUseCase,
  ) {}

  async execute(input: CreateNewsArticleInput): Promise<NewsArticleOutput> {
    const newsType = await this.newsTypeRepository.findById(input.newsTypeId);
    if (!newsType || !newsType.isActive) {
      throw new InvalidNewsTypeError();
    }

    const title = input.title.trim();
    const description = input.description.trim();
    const slug = await generateNewsArticleSlug(title, async (candidate) => {
      const existing = await this.newsArticleRepository.findBySlug(candidate);
      return existing !== null;
    });

    const article = await this.newsArticleRepository.create({
      title,
      slug,
      description,
      publishedAt: input.publishedAt,
      newsTypeId: input.newsTypeId,
      createdBy: input.userId,
    });

    const excerpt = description.length > EXCERPT_LENGTH ? description.slice(0, EXCERPT_LENGTH) : description;
    await this.createNewsNotificationsForArticleUseCase.execute({
      articleId: article.id,
      slug: article.slug,
      title: article.title,
      excerpt,
      newsTypeId: article.newsTypeId,
      newsTypeName: article.newsTypeName,
    });

    return toNewsArticleOutput(article);
  }
}
