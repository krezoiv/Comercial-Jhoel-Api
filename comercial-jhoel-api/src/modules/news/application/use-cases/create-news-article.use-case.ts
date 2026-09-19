import { Inject, Injectable, Logger } from '@nestjs/common';
import { NEWS_ARTICLE_REPOSITORY } from '../../domain/repositories/news-article.repository';
import type { NewsArticleRepository } from '../../domain/repositories/news-article.repository';
import { NEWS_TYPE_REPOSITORY } from '../../../news-types/domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../../news-types/domain/repositories/news-type.repository';
import { InvalidNewsTypeError } from '../../../news-types/domain/errors/invalid-news-type.error';
import { SendPushForArticleUseCase } from '../../../news-subscriptions/application/use-cases/send-push-for-article.use-case';
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
 * Único punto donde se dispara el aviso por Web Push (solo NUEVA NOTICIA
 * — `UpdateNewsArticleUseCase` nunca lo llama). El envío es un proceso
 * secundario: cualquier fallo queda contenido aquí sin poder tumbar ni
 * retrasar la publicación de la noticia (ver el doc comment de
 * `SendPushForArticleUseCase`).
 */
@Injectable()
export class CreateNewsArticleUseCase {
  private readonly logger = new Logger(CreateNewsArticleUseCase.name);

  constructor(
    @Inject(NEWS_ARTICLE_REPOSITORY)
    private readonly newsArticleRepository: NewsArticleRepository,
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
    private readonly sendPushForArticleUseCase: SendPushForArticleUseCase,
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

    try {
      const excerpt = description.length > EXCERPT_LENGTH ? description.slice(0, EXCERPT_LENGTH) : description;
      await this.sendPushForArticleUseCase.execute({
        articleId: article.id,
        slug: article.slug,
        title: article.title,
        excerpt,
        newsTypeId: article.newsTypeId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al procesar el envío push.';
      this.logger.error(`No se pudo procesar el envío push para la noticia ${article.id}: ${message}`);
    }

    return toNewsArticleOutput(article);
  }
}
