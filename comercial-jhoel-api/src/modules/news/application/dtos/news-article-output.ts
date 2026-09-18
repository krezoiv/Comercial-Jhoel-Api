import { NewsArticle } from '../../domain/entities/news-article.entity';

export interface NewsArticleOutput {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  isActive: boolean;
  sortOrder: number;
  likesCount: number;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver. */
export interface PublicNewsArticleOutput {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  hasImage: boolean;
  likesCount: number;
  /** Si el visitante actual (header `X-Visitor-Id`) ya le dio like — `false` sin header (primera visita). */
  liked: boolean;
}

export function toNewsArticleOutput(article: NewsArticle): NewsArticleOutput {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    isActive: article.isActive,
    sortOrder: article.sortOrder,
    likesCount: article.likesCount,
    hasImage: article.hasImage,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    createdBy: article.createdBy,
    createdByUsername: article.createdByUsername,
    updatedBy: article.updatedBy,
    updatedByUsername: article.updatedByUsername,
  };
}

export function toPublicNewsArticleOutput(
  article: NewsArticle,
  likesCount: number,
  liked: boolean,
): PublicNewsArticleOutput {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    hasImage: article.hasImage,
    likesCount,
    liked,
  };
}
