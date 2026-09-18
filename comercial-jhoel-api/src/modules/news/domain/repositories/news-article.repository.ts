import { NewsArticle } from '../entities/news-article.entity';

export const NEWS_ARTICLE_REPOSITORY = Symbol('NEWS_ARTICLE_REPOSITORY');

export interface CreateNewsArticleData {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
  createdBy: string;
}

export interface UpdateNewsArticleData {
  title?: string;
  description?: string;
  publishedAt?: string;
  newsTypeId?: string;
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
  /** Cualquier estado — usado solo para el chequeo de unicidad de slug al crear. */
  findBySlug(slug: string): Promise<NewsArticle | null>;
  findPublished(): Promise<NewsArticle[]>;
  /** URL pública real (`/noticias/:slug`) — solo entre activas, mismo criterio de "no revela existencia" que `findById` en el use case público. */
  findPublishedBySlug(slug: string): Promise<NewsArticle | null>;
  create(data: CreateNewsArticleData): Promise<NewsArticle>;
  update(id: string, data: UpdateNewsArticleData): Promise<NewsArticle>;
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  reorder(items: ReorderNewsArticleItem[]): Promise<void>;
  /** Incremento atómico (`delta` +1/-1) — nunca lee-modifica-escribe desde la aplicación. Nunca baja de 0. Devuelve el conteo resultante. */
  adjustLikes(id: string, delta: number): Promise<number>;
  setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>;
  removeImage(id: string, updatedBy: string): Promise<void>;
  getImage(id: string): Promise<NewsArticleImageBytes | null>;
}
