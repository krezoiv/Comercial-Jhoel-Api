import { NewsArticle } from '../entities/news-article.entity';

export const NEWS_ARTICLE_REPOSITORY = Symbol('NEWS_ARTICLE_REPOSITORY');

export interface CreateNewsArticleData {
  title: string;
  description: string;
  publishedAt: string;
  createdBy: string;
}

export interface UpdateNewsArticleData {
  title?: string;
  description?: string;
  publishedAt?: string;
  updatedBy: string;
}

export interface ListNewsArticlesOptions {
  includeInactive?: boolean;
  search?: string;
}

export interface ReorderNewsArticleItem {
  id: string;
  sortOrder: number;
}

export interface NewsArticleImageBytes {
  data: Buffer;
  mimeType: string;
}

export interface NewsArticleRepository {
  findAll(options?: ListNewsArticlesOptions): Promise<NewsArticle[]>;
  findById(id: string): Promise<NewsArticle | null>;
  findPublished(): Promise<NewsArticle[]>;
  create(data: CreateNewsArticleData): Promise<NewsArticle>;
  update(id: string, data: UpdateNewsArticleData): Promise<NewsArticle>;
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  reorder(items: ReorderNewsArticleItem[]): Promise<void>;
  setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>;
  removeImage(id: string, updatedBy: string): Promise<void>;
  getImage(id: string): Promise<NewsArticleImageBytes | null>;
}
