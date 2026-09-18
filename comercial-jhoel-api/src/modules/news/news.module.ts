import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModule } from '../likes/likes.module';
import { NewsTypesModule } from '../news-types/news-types.module';
import { NewsSubscriptionsModule } from '../news-subscriptions/news-subscriptions.module';
import { NewsArticleOrmEntity } from './infrastructure/persistence/news-article.orm-entity';
import { TypeOrmNewsArticleRepository } from './infrastructure/persistence/typeorm-news-article.repository';
import { NEWS_ARTICLE_REPOSITORY } from './domain/repositories/news-article.repository';
import { CreateNewsArticleUseCase } from './application/use-cases/create-news-article.use-case';
import { UpdateNewsArticleUseCase } from './application/use-cases/update-news-article.use-case';
import { ListNewsArticlesUseCase } from './application/use-cases/list-news-articles.use-case';
import { GetNewsArticleByIdUseCase } from './application/use-cases/get-news-article-by-id.use-case';
import { SetNewsArticleActiveUseCase } from './application/use-cases/set-news-article-active.use-case';
import { ReorderNewsArticlesUseCase } from './application/use-cases/reorder-news-articles.use-case';
import { SetNewsArticleImageUseCase } from './application/use-cases/set-news-article-image.use-case';
import { RemoveNewsArticleImageUseCase } from './application/use-cases/remove-news-article-image.use-case';
import { ListPublishedNewsArticlesUseCase } from './application/use-cases/list-published-news-articles.use-case';
import { GetPublishedNewsArticleByIdUseCase } from './application/use-cases/get-published-news-article-by-id.use-case';
import { GetPublishedNewsArticleBySlugUseCase } from './application/use-cases/get-published-news-article-by-slug.use-case';
import { GetNewsArticleImageUseCase } from './application/use-cases/get-news-article-image.use-case';
import { LikeNewsArticleUseCase } from './application/use-cases/like-news-article.use-case';
import { NewsController } from './presentation/controllers/news.controller';
import { PublicNewsController } from './presentation/controllers/public-news.controller';

/**
 * "Noticias" — contenido editorial, completamente independiente de
 * Inventario/Teléfonos/Librería/Variedades. Sin producto, sin precio, sin
 * WhatsApp, sin Krediya. `description` es siempre texto plano.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NewsArticleOrmEntity]), LikesModule, NewsTypesModule, NewsSubscriptionsModule],
  controllers: [NewsController, PublicNewsController],
  providers: [
    { provide: NEWS_ARTICLE_REPOSITORY, useClass: TypeOrmNewsArticleRepository },
    CreateNewsArticleUseCase,
    UpdateNewsArticleUseCase,
    ListNewsArticlesUseCase,
    GetNewsArticleByIdUseCase,
    SetNewsArticleActiveUseCase,
    ReorderNewsArticlesUseCase,
    SetNewsArticleImageUseCase,
    RemoveNewsArticleImageUseCase,
    ListPublishedNewsArticlesUseCase,
    GetPublishedNewsArticleByIdUseCase,
    GetPublishedNewsArticleBySlugUseCase,
    GetNewsArticleImageUseCase,
    LikeNewsArticleUseCase,
  ],
})
export class NewsModule {}
